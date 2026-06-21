const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const mockDir = __dirname;
global.__mockDbStore = {};
const mockModels = {};

function getFilePath(modelName) {
  // Map models to plural lowercase file names
  let pluralName = modelName.toLowerCase() + 's';
  if (pluralName === 'categorys') pluralName = 'categories';
  return path.join(mockDir, `${pluralName}.json`);
}

global.__loadMockCollection = function(modelName) {
  const filePath = getFilePath(modelName);
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      global.__mockDbStore[modelName] = JSON.parse(data);
    } catch (e) {
      global.__mockDbStore[modelName] = [];
    }
  } else {
    global.__mockDbStore[modelName] = [];
  }
};

global.__saveMockCollection = function(modelName) {
  const filePath = getFilePath(modelName);
  try {
    fs.writeFileSync(filePath, JSON.stringify(global.__mockDbStore[modelName] || [], null, 2), 'utf8');
  } catch (e) {
    console.error(`Failed to save mock collection ${modelName}:`, e);
  }
};

// Match Mongoose-like Query matching helper
function matchQuery(item, query) {
  if (!query || Object.keys(query).length === 0) return true;

  for (const key of Object.keys(query)) {
    const val = query[key];

    if (key === '$or') {
      if (!Array.isArray(val)) continue;
      const matchedAny = val.some(subQuery => matchQuery(item, subQuery));
      if (!matchedAny) return false;
      continue;
    }

    const itemVal = item[key];

    if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof RegExp)) {
      let baseVal = itemVal;
      if (baseVal instanceof Date) baseVal = baseVal.getTime();
      else if (typeof baseVal === 'string' && !isNaN(Date.parse(baseVal))) baseVal = new Date(baseVal).getTime();

      const getCompareVal = (v) => {
        if (v instanceof Date) return v.getTime();
        if (typeof v === 'string' && !isNaN(Date.parse(v))) return new Date(v).getTime();
        return v;
      };

      if (val.$gte !== undefined) {
        if (!(baseVal >= getCompareVal(val.$gte))) return false;
      }
      if (val.$gt !== undefined) {
        if (!(baseVal > getCompareVal(val.$gt))) return false;
      }
      if (val.$lte !== undefined) {
        if (!(baseVal <= getCompareVal(val.$lte))) return false;
      }
      if (val.$lt !== undefined) {
        if (!(baseVal < getCompareVal(val.$lt))) return false;
      }
      if (val.$regex !== undefined) {
        const flags = val.$options || '';
        const regex = new RegExp(val.$regex, flags);
        if (!regex.test(itemVal || '')) return false;
      }
    } else {
      // Direct comparison
      const targetStr = (val !== null && val !== undefined) ? val.toString() : '';
      const itemStr = (itemVal !== null && itemVal !== undefined) ? itemVal.toString() : '';
      if (itemStr !== targetStr) return false;
    }
  }

  return true;
}

// Mock Query chaining class
class MockQuery {
  constructor(data, isSingle = false) {
    this.data = data;
    this.isSingle = isSingle;
  }

  select(fields) {
    // Keep password property in User/Admin if select('+password') is requested
    // Since we don't selectively hide fields in our mock data by default, it works out of the box
    return this;
  }

  populate(fieldPath, selectFields) {
    if (!this.data) return this;

    if (this.isSingle) {
      this._populateDoc(this.data, fieldPath, selectFields);
    } else {
      this.data.forEach(doc => this._populateDoc(doc, fieldPath, selectFields));
    }
    return this;
  }

  _populateDoc(doc, fieldPath, selectFields) {
    let path = typeof fieldPath === 'string' ? fieldPath : fieldPath.path;
    const val = doc[path];
    if (!val) return;

    let targetModel = null;
    if (path === 'user') targetModel = 'User';
    else if (path === 'destination') targetModel = 'Destination';
    else if (path === 'package') targetModel = 'Package';
    else if (path === 'booking') targetModel = 'Booking';

    if (targetModel) {
      const dbStore = global.__mockDbStore;
      const refId = val.toString();
      const matched = dbStore[targetModel].find(item => item._id.toString() === refId);
      if (matched) {
        const populatedCopy = JSON.parse(JSON.stringify(matched));
        
        if (selectFields && typeof selectFields === 'string') {
          const keys = selectFields.split(' ');
          const filtered = {};
          keys.forEach(k => {
            if (populatedCopy[k] !== undefined) filtered[k] = populatedCopy[k];
          });
          filtered._id = populatedCopy._id;
          doc[path] = filtered;
        } else {
          doc[path] = populatedCopy;
        }

        // Handle nested populate (e.g. populate: { path: 'package' })
        if (typeof fieldPath === 'object' && fieldPath.populate) {
          this._populateDoc(doc[path], fieldPath.populate);
        }
      }
    }
    return this;
  }

  sort(sortStr) {
    if (this.isSingle || !this.data || !Array.isArray(this.data)) return this;
    const isDescending = sortStr.startsWith('-');
    const field = isDescending ? sortStr.slice(1) : sortStr;

    this.data.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      if (valA instanceof Date) valA = valA.getTime();
      if (valB instanceof Date) valB = valB.getTime();

      if (valA < valB) return isDescending ? 1 : -1;
      if (valA > valB) return isDescending ? -1 : 1;
      return 0;
    });

    return this;
  }

  then(onFulfilled, onRejected) {
    return Promise.resolve(this.data).then(onFulfilled, onRejected);
  }

  catch(onRejected) {
    return Promise.resolve(this.data).catch(onRejected);
  }
}

// Mock Mongoose Document instance
class MockDocument {
  constructor(modelName, data) {
    this.__modelName = modelName;
    Object.assign(this, JSON.parse(JSON.stringify(data)));
    
    if (!this._id) {
      this._id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    if (!this.createdAt) this.createdAt = new Date().toISOString();
    if (!this.updatedAt) this.updatedAt = new Date().toISOString();

    // Dynamically assign schema methods to this instance
    const mockModel = mockModels[modelName];
    if (mockModel && mockModel.prototypeMethods) {
      for (const [methodName, fn] of Object.entries(mockModel.prototypeMethods)) {
        this[methodName] = fn.bind(this);
      }
    }
  }

  isModified(field) {
    return true; 
  }

  async save() {
    const dbStore = global.__mockDbStore;
    const collection = dbStore[this.__modelName];
    
    // Encrypt password if User or Admin and not already hashed
    if ((this.__modelName === 'User' || this.__modelName === 'Admin') && this.password && !this.password.startsWith('$2a$')) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    const idx = collection.findIndex(item => item._id === this._id);
    this.updatedAt = new Date().toISOString();
    
    const plainDoc = {};
    for (const key of Object.keys(this)) {
      if (!key.startsWith('__') && typeof this[key] !== 'function') {
        plainDoc[key] = this[key];
      }
    }

    if (idx >= 0) {
      collection[idx] = plainDoc;
    } else {
      collection.push(plainDoc);
    }

    global.__saveMockCollection(this.__modelName);

    // Call post save triggers (like Review's getAverageRating)
    if (this.__modelName === 'Review') {
      const ReviewModel = mockModels['Review'];
      if (ReviewModel && ReviewModel.getAverageRating) {
        await ReviewModel.getAverageRating(this.destination);
      }
    }

    return this;
  }

  async deleteOne() {
    const dbStore = global.__mockDbStore;
    const collection = dbStore[this.__modelName];
    const idx = collection.findIndex(item => item._id === this._id);
    if (idx >= 0) {
      collection.splice(idx, 1);
      global.__saveMockCollection(this.__modelName);
    }

    // Call post delete triggers (like Review's getAverageRating)
    if (this.__modelName === 'Review') {
      const ReviewModel = mockModels['Review'];
      if (ReviewModel && ReviewModel.getAverageRating) {
        await ReviewModel.getAverageRating(this.destination);
      }
    }
  }

  async matchPassword(enteredPassword) {
    const bcrypt = require('bcryptjs');
    return await bcrypt.compare(enteredPassword, this.password);
  }
}

// Function to create a new MockModel constructor & statics
function createMockModel(modelName) {
  class ModelClass {
    constructor(data) {
      return new MockDocument(modelName, data);
    }
  }

  ModelClass.modelName = modelName;

  ModelClass.find = function(query) {
    const dbStore = global.__mockDbStore;
    const collection = dbStore[modelName] || [];
    const matched = collection.filter(item => matchQuery(item, query));
    const matchedCopies = JSON.parse(JSON.stringify(matched));
    return new MockQuery(matchedCopies, false);
  };

  ModelClass.findOne = function(query) {
    const dbStore = global.__mockDbStore;
    const collection = dbStore[modelName] || [];
    const matched = collection.find(item => matchQuery(item, query));
    const matchedCopy = matched ? JSON.parse(JSON.stringify(matched)) : null;
    return new MockQuery(matchedCopy ? new MockDocument(modelName, matchedCopy) : null, true);
  };

  ModelClass.findById = function(id) {
    if (!id) return new MockQuery(null, true);
    const dbStore = global.__mockDbStore;
    const collection = dbStore[modelName] || [];
    const matched = collection.find(item => item._id.toString() === id.toString());
    const matchedCopy = matched ? JSON.parse(JSON.stringify(matched)) : null;
    return new MockQuery(matchedCopy ? new MockDocument(modelName, matchedCopy) : null, true);
  };

  ModelClass.create = async function(docs) {
    const dbStore = global.__mockDbStore;
    const collection = dbStore[modelName] || [];
    const isArray = Array.isArray(docs);
    const docsArray = isArray ? docs : [docs];

    const results = [];
    for (const docData of docsArray) {
      const doc = new MockDocument(modelName, docData);
      
      if ((modelName === 'User' || modelName === 'Admin') && doc.password) {
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        doc.password = await bcrypt.hash(doc.password, salt);
      }

      const plainDoc = {};
      for (const key of Object.keys(doc)) {
        if (!key.startsWith('__') && typeof doc[key] !== 'function') {
          plainDoc[key] = doc[key];
        }
      }

      collection.push(plainDoc);
      results.push(doc);
    }
    
    global.__saveMockCollection(modelName);

    if (modelName === 'Review') {
      const ReviewModel = mockModels['Review'];
      if (ReviewModel && ReviewModel.getAverageRating) {
        for (const r of results) {
          await ReviewModel.getAverageRating(r.destination);
        }
      }
    }

    return isArray ? results : results[0];
  };

  ModelClass.findByIdAndUpdate = async function(id, update, options = {}) {
    const dbStore = global.__mockDbStore;
    const collection = dbStore[modelName] || [];
    const idx = collection.findIndex(item => item._id.toString() === id.toString());
    if (idx === -1) return null;

    let doc = collection[idx];
    const fieldsToUpdate = update.$set || update;

    Object.assign(doc, JSON.parse(JSON.stringify(fieldsToUpdate)));
    doc.updatedAt = new Date().toISOString();
    
    collection[idx] = doc;
    global.__saveMockCollection(modelName);

    if (modelName === 'Review') {
      const ReviewModel = mockModels['Review'];
      if (ReviewModel && ReviewModel.getAverageRating) {
        await ReviewModel.getAverageRating(doc.destination);
      }
    }

    return new MockDocument(modelName, doc);
  };

  ModelClass.findByIdAndDelete = async function(id) {
    return ModelClass.deleteOne({ _id: id });
  };

  ModelClass.deleteOne = async function(query = {}) {
    const dbStore = global.__mockDbStore;
    const collection = dbStore[modelName] || [];
    const idx = collection.findIndex(item => matchQuery(item, query));
    if (idx === -1) return { deletedCount: 0 };

    const [deletedItem] = collection.splice(idx, 1);
    global.__saveMockCollection(modelName);

    if (modelName === 'Review') {
      const ReviewModel = mockModels['Review'];
      if (ReviewModel && ReviewModel.getAverageRating) {
        await ReviewModel.getAverageRating(deletedItem.destination);
      }
    }

    return { deletedCount: 1 };
  };

  ModelClass.deleteMany = async function(query = {}) {
    const dbStore = global.__mockDbStore;
    const collection = dbStore[modelName] || [];
    const itemsToDelete = collection.filter(item => matchQuery(item, query));
    dbStore[modelName] = collection.filter(item => !matchQuery(item, query));
    global.__saveMockCollection(modelName);

    if (modelName === 'Review') {
      const ReviewModel = mockModels['Review'];
      if (ReviewModel && ReviewModel.getAverageRating) {
        for (const r of itemsToDelete) {
          await ReviewModel.getAverageRating(r.destination);
        }
      }
    }

    return { deletedCount: itemsToDelete.length };
  };

  ModelClass.countDocuments = async function(query = {}) {
    const dbStore = global.__mockDbStore;
    const collection = dbStore[modelName] || [];
    const matched = collection.filter(item => matchQuery(item, query));
    return matched.length;
  };

  ModelClass.aggregate = async function(pipeline) {
    const matchStage = pipeline.find(stage => stage.$match);
    const destinationId = matchStage ? matchStage.$match.destination : null;

    if (!destinationId) return [];

    const dbStore = global.__mockDbStore;
    const reviews = dbStore['Review'] || [];
    const matchingReviews = reviews.filter(r => r.destination.toString() === destinationId.toString());

    if (matchingReviews.length === 0) return [];

    const totalRating = matchingReviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = totalRating / matchingReviews.length;

    return [{
      _id: destinationId,
      averageRating: avg,
      reviewsCount: matchingReviews.length
    }];
  };

  return ModelClass;
}

// Hijack mongoose.model
const originalModel = mongoose.model;
mongoose.model = function(name, schema) {
  const canonicalName = name;
  if (mockModels[canonicalName]) {
    return mockModels[canonicalName];
  }
  
  const mockModel = createMockModel(canonicalName);
  
  if (schema) {
    if (schema.statics) {
      Object.assign(mockModel, schema.statics);
    }
    if (schema.methods) {
      mockModel.prototypeMethods = schema.methods;
    }
  }
  
  global.__loadMockCollection(canonicalName);
  mockModels[canonicalName] = mockModel;
  return mockModel;
};

// Hijack readyState getter
Object.defineProperty(mongoose.connection, 'readyState', {
  get: () => {
    return process.env.USE_MOCK_DATA === 'true' ? 1 : 0;
  },
  configurable: true
});

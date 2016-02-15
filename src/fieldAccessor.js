import arrayAccessor from './arrayAccessor';
import getType from './getType';

function fieldAccessor (obj, fieldTypes) {

   return {

       apply: function (data) {
           obj = data;
       },

       get: function (key) {

           const type = getType(fieldTypes[key]);

           if (!fieldTypes[key]) {
                throw new Error('There is no field definition for getting ' + key + '. Available fields are: ' + JSON.stringify(obj));
           }

           if (type === 'array') {
             obj[key] = obj[key] || [];

             return arrayAccessor(obj[key], fieldTypes[key]);
           }

           if (type === 'object') {
               obj[key] = obj[key] || {};

               return fieldAccessor(obj[key], fieldTypes[key]);
           }

           return obj[key];
       },

       set: function (key, value) {

           const type = getType(fieldTypes[key]);

           if (!fieldTypes[key]) {
               const fields = JSON.stringify(obj);

                throw new Error(`There is no field definition for setting ${key}. Available fields are: ${fields}.`);
           }

           if (typeof value !== type) {
               throw new Error(`Invalid type for ${key}. Expecting ${type} but got ${typeof value}.`);
           }

           obj[key] = value;

           return this;
       },

       toJSON: function () {
          return obj;
       }
   };
}

export default fieldAccessor;

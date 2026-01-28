/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  
    const collection = new Collection({
      id: "categories",
      name: "categories",
      type: "base",
      system: false,
      fields: [
      {
          name: "name",
          type: "text",
          required: true,
          min: 1,
          max: 100
        },
      {
          name: "slug",
          type: "text",
          required: true,
          min: 1,
          max: 100,
          pattern: "^[a-z0-9-]+$"
        },
      {
          name: "description",
          type: "text",
          required: false,
          max: 500
        },
      {
          name: "icon",
          type: "text",
          required: false,
          max: 10
        }
    ],
      indexes: [
      "CREATE UNIQUE INDEX idx_categories_slug ON categories (slug)"
    ],
      listRule: "",
      viewRule: "",
      createRule: null,
      updateRule: null,
      deleteRule: null
    });
  
    return app.save(collection);
}, (app) => {
  
    const collection = app.findCollectionByNameOrId("categories");
  
    return app.delete(collection);
});

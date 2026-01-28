/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  
    const collection = new Collection({
      id: "images",
      name: "images",
      type: "base",
      system: false,
      fields: [
      {
          name: "file",
          type: "file",
          required: true,
          maxSelect: 1,
          maxSize: 10485760,
          mimeTypes: [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif"
        ]
        },
      {
          name: "alt",
          type: "text",
          required: false,
          max: 200
        }
    ],
      // Anyone can view images
      listRule: "",
      viewRule: "",
      // Only authenticated users can upload
      createRule: "",
      updateRule: "",
      deleteRule: ""
    });
  
    return app.save(collection);
}, (app) => {
  
    const collection = app.findCollectionByNameOrId("images");
  
    return app.delete(collection);
});

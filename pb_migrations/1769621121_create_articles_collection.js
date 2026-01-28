/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  
    const collection = new Collection({
      id: "articles",
      name: "articles",
      type: "base",
      system: false,
      fields: [
      {
          name: "title",
          type: "text",
          required: true,
          min: 1,
          max: 200
        },
      {
          name: "slug",
          type: "text",
          required: true,
          min: 1,
          max: 200
        },
      {
          name: "excerpt",
          type: "text",
          required: true,
          min: 1,
          max: 500
        },
      {
          name: "content",
          type: "editor",
          required: true
        },
      {
          name: "cover_image",
          type: "file",
          required: false,
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif"
        ]
        },
      {
          name: "category",
          type: "relation",
          required: false,
          collectionId: "categories",
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1
        },
      {
          name: "tags",
          type: "json",
          required: false
        },
      {
          name: "published",
          type: "bool",
          required: false
        },
      {
          name: "publication_date",
          type: "date",
          required: true
        }
    ],
      indexes: [
      "CREATE UNIQUE INDEX idx_articles_slug ON articles (slug)",
      "CREATE INDEX idx_articles_published ON articles (published)",
      "CREATE INDEX idx_articles_publication_date ON articles (publication_date)"
    ],
      // Empty string = no restrictions (superusers bypass rules anyway)
      // We handle published/draft filtering in the frontend
      listRule: "",
      viewRule: "",
      createRule: "",
      updateRule: "",
      deleteRule: ""
    });
  
    return app.save(collection);
}, (app) => {
  
    const collection = app.findCollectionByNameOrId("articles");
  
    return app.delete(collection);
});

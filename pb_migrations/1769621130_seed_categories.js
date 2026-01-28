/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const collection = app.findCollectionByNameOrId("categories");
  
  const categories = [
    { name: "Retrogaming", slug: "retrogaming", description: "Collecting and preserving gaming history", icon: "🎮" },
    { name: "Modding", slug: "modding", description: "Hardware and software modifications", icon: "🔧" },
    { name: "Vibecoding", slug: "vibecoding", description: "Building things with AI and creative coding", icon: "💻" },
    { name: "Music", slug: "music", description: "Production, discovery, and playlists", icon: "🎵" },
    { name: "Self-Improvement", slug: "self-improvement", description: "Productivity, habits, personal development", icon: "🎯" },
    { name: "Sports", slug: "sports", description: "Hiking, bikepacking, outdoor adventures", icon: "🏃" },
    { name: "AI", slug: "ai", description: "Tools, experiments, and thoughts on the future", icon: "🤖" },
    { name: "Marketing", slug: "marketing", description: "Acquisition, growth, digital strategies", icon: "📈" },
    { name: "Books", slug: "books", description: "Reviews, notes, and recommendations", icon: "📚" },
  ];

  for (const cat of categories) {
    const record = new Record(collection);
    record.set("name", cat.name);
    record.set("slug", cat.slug);
    record.set("description", cat.description);
    record.set("icon", cat.icon);
    app.save(record);
  }
}, (app) => {
  // Revert: delete all seeded categories
  const collection = app.findCollectionByNameOrId("categories");
  const records = app.findRecordsByFilter(collection, "1=1");
  for (const record of records) {
    app.delete(record);
  }
});

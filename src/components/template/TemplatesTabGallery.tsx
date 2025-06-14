
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Template } from "@/types/template";
import { Search, Plus, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplatesTabGalleryProps {
  templates: Template[];
  onSelect: (template: Template) => void;
  onUpload: () => void;
}

const BUILTIN_CATEGORIES = [
  "All",
  "Event Flyer",
  "Business Card",
  "Product Label",
  "Coupon",
  "Poster",
  "Other"
];

const TemplatesTabGallery: React.FC<TemplatesTabGalleryProps> = ({
  templates,
  onSelect,
  onUpload,
}) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const builtinTemplates = templates.filter(
    (t) => t.isPublic || t.isBuiltin || t.is_builtin
  );
  const userTemplates = templates.filter(
    (t) => !t.isPublic && !t.isBuiltin && !t.is_builtin
  );

  const filteredBuiltin = builtinTemplates.filter((t) => {
    const catMatch =
      category === "All" ||
      t.category?.toLowerCase() === category.toLowerCase();
    const searchMatch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category?.toLowerCase().includes(search.toLowerCase()) ||
      (!!t.tags && t.tags.join(" ").toLowerCase().includes(search.toLowerCase()));
    return catMatch && searchMatch;
  });
  const filteredUser = userTemplates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-2 items-center">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="max-w-xs"
          />
          <Button variant="outline" className="ml-1" onClick={onUpload}>
            <Plus className="w-4 h-4 mr-1" /> Upload Template
          </Button>
        </div>
        <div className="flex gap-2">
          {BUILTIN_CATEGORIES.map((c) => (
            <Button
              key={c}
              variant={c === category ? "default" : "outline"}
              onClick={() => setCategory(c)}
              className={cn(
                "capitalize px-4 py-1",
                c === category ? "bg-indigo-600 text-white" : ""
              )}
              size="sm"
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg text-gray-800 mb-2 flex items-center">
          <LayoutGrid className="w-5 h-5 mr-1" /> Built-In Templates
        </h3>
        {filteredBuiltin.length === 0 ? (
          <div className="text-gray-500 py-16 text-center">
            No built-in templates found. Try another search or filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
            {filteredBuiltin.map((tpl) => (
              <Card
                key={tpl.id}
                className="cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-shadow p-2 flex flex-col items-center justify-between"
                onClick={() => onSelect(tpl)}
              >
                <div className="w-full aspect-[4/3] flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden mb-2">
                  <img
                    src={tpl.thumbnail_url || tpl.preview || "/default-template.png"}
                    alt={tpl.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-full flex flex-col items-center px-2 pb-1">
                  <div className="font-semibold text-sm text-gray-700 truncate w-full text-center">
                    {tpl.name}
                  </div>
                  <div className="text-xs text-gray-400 ">
                    {tpl.category || "Misc"}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-lg text-gray-800 mb-2 flex items-center">
          <LayoutGrid className="w-5 h-5 mr-1" /> My Templates
        </h3>
        {filteredUser.length === 0 ? (
          <div className="text-gray-500 py-8 text-center">
            No templates yet. Upload one or select from built-in!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
            {filteredUser.map((tpl) => (
              <Card
                key={tpl.id}
                className="cursor-pointer hover:ring-2 hover:ring-blue-400 transition-shadow p-2 flex flex-col items-center justify-between"
                onClick={() => onSelect(tpl)}
              >
                <div className="w-full aspect-[4/3] flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden mb-2">
                  <img
                    src={tpl.thumbnail_url || tpl.preview || "/default-template.png"}
                    alt={tpl.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-semibold text-sm text-gray-700 truncate w-full text-center">
                  {tpl.name}
                </div>
                <div className="text-xs text-gray-400">{tpl.category || "Custom"}</div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesTabGallery;

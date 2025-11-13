"use client";

import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";

interface Item {
  id: number;
  title: string;
  price?: number;
}

interface MultiSelectProps {
  label: string;
  items: Item[];
  selected: Item[];
  setSelected: (items: Item[]) => void;
}

export default function MultiSelect({
  label,
  items,
  selected,
  setSelected,
}: MultiSelectProps) {
  const [query, setQuery] = useState("");

  const filteredItems =
    query === ""
      ? items
      : items.filter((item) =>
          item.title.toLowerCase().includes(query.toLowerCase())
        );

  const toggleItem = (item: Item) => {
    if (selected.some((s) => s.id === item.id)) {
      setSelected(selected.filter((s) => s.id !== item.id));
    } else {
      setSelected([...selected, item]);
    }
  };

  return (
    <div className="w-full">
      <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
        {label}
      </label>

      <Listbox value={selected} onChange={setSelected} multiple>
        <div className="relative mt-1">
          <Listbox.Button className="w-full flex justify-between items-center border rounded-lg bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 px-3 py-2">
            <span className="truncate">
              {selected.length === 0
                ? `Select ${label}`
                : selected.map((s) => s.title).join(", ")}
            </span>
            <ChevronDown className="h-4 w-4 opacity-60" />
          </Listbox.Button>

          <Transition
            as={Fragment}
            enter="transition duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
          >
            <div className="absolute z-20 mt-2 w-full bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-auto">

              <input
                className="w-full p-2 border-b dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none text-sm"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              {filteredItems.length === 0 ? (
                <p className="p-2 text-sm text-gray-500 dark:text-gray-400">
                  No results found
                </p>
              ) : (
                filteredItems.map((item) => (
                  <Listbox.Option key={item.id} value={item} as="div">
                    <div
                      onClick={() => toggleItem(item)}
                      className="cursor-pointer flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                    >
                      <input
                        type="checkbox"
                        readOnly
                        className="accent-gray-700"
                        checked={selected.some((s) => s.id === item.id)}
                      />
                      <span className="flex-1 dark:text-white">
                        {item.title}
                      </span>
                      {item.price !== undefined && (
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Rs {item.price}
                        </span>
                      )}
                      {selected.some((s) => s.id === item.id) && (
                        <Check className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                      )}
                    </div>
                  </Listbox.Option>
                ))
              )}
            </div>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

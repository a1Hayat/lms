"use client";

import { useEffect, useState, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { AppAlert } from "@/components/alerts";
import Loader from "@/components/loader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Item {
  id: number;
  title: string;
  price: number;
}

// 1. Define Props Interface for the Helper Component
interface MultiSelectProps {
  label: string;
  items: Item[];
  selected: Item[];
  setSelected: (items: Item[]) => void;
}

export default function CreateBundle() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");

  const [courses, setCourses] = useState<Item[]>([]);
  const [resources, setResources] = useState<Item[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Item[]>([]);
  const [selectedResources, setSelectedResources] = useState<Item[]>([]);
  const [originalPrice, setOriginalPrice] = useState(0);

  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const [c, r] = await Promise.all([
        fetch("/api/courses/fetch-all-ids").then((res) => res.json()),
        fetch("/api/resources/fetch-all-ids").then((res) => res.json()),
      ]);

      setCourses(c);
      setResources(r);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const total =
      selectedCourses.reduce((s, c) => s + Number(c.price), 0) +
      selectedResources.reduce((s, r) => s + Number(r.price), 0);

    setOriginalPrice(total);
  }, [selectedCourses, selectedResources]);

  // 2. Fix Event Type
  const submitBundle = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !discountedPrice || (selectedCourses.length === 0 && selectedResources.length === 0)) {
      return setAlert({
        show: true,
        type: "error",
        title: "Missing Fields",
        description: "Bundle name, price, and at least one item are required.",
      });
    }

    setLoading(true)
    const res = await fetch("/api/bundles/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        originalPrice,
        discountedPrice,
        courses: selectedCourses.map((c) => c.id),
        resources: selectedResources.map((r) => r.id),
      }),
    });

    const data = await res.json();
    setAlert({
      show: true,
      type: res.ok ? "success" : "error",
      title: res.ok ? "Bundle Created" : "Error",
      description: data.message,
    });

    if (res.ok) {
      setName("");
      setDescription("");
      setDiscountedPrice("");
      setSelectedCourses([]);
      setSelectedResources([]);
      setOriginalPrice(0);
    }
     setLoading(false)
  };

  // 3. Fix Component Props Type
  const MultiSelect = ({ label, items, selected, setSelected }: MultiSelectProps) => (
    <div>
      <label className="block text-sm font-medium mb-1 dark:text-gray-200">{label}</label>

      <Listbox value={selected} onChange={setSelected} multiple>
        <div className="relative">
          <Listbox.Button className="w-full text-sm border dark:bg-[#0f0f0f] bg-gray-50 dark:border-[#333] px-3 py-2 rounded-md text-left dark:text-white">
            {/* 4. Fix implicit any in map by relying on Item[] type from props */}
            {selected.length === 0 ? `Select ${label}` : selected.map((s) => s.title).join(", ")}
          </Listbox.Button>

          <Transition as={Fragment} enter="transition duration-100" enterFrom="opacity-0" enterTo="opacity-100">
            <Listbox.Options className="absolute mt-1 w-full dark:bg-[#1f1f1f] bg-white border dark:border-[#0f0f0f] rounded-md max-h-52 overflow-auto z-20 shadow-sm">
              {items.map((item: Item) => (
                <Listbox.Option key={item.id} value={item}>
                  <div className="cursor-pointer px-2 py-2 text-sm flex gap-2 hover:bg-gray-200 dark:hover:bg-[#333]">
                    <input type="checkbox" readOnly checked={selected.some((s: Item) => s.id === item.id)} />
                    <span className="dark:text-white">{item.title} — Rs {item.price}</span>
                  </div>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );

  if (loading) return (<Loader isLoading={true} className=""/>);

  return (
    <div className="w-full mx-auto p-4 sm:p-6">
      <AppAlert
        type={alert.type}
        title={alert.title}
        description={alert.description}
        open={alert.show}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <h1 className="text-xl font-bold mb-4 ">Create Bundle</h1>

      <form onSubmit={submitBundle} className="space-y-4">
        <div>
          <Label className="block text-sm mb-1 ">Bundle Name *</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border text-sm "
            required
          />
        </div>

        <div>
          <Label className="block text-sm mb-1 dark:text-gray-300">Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border text-sm "
            rows={2}
          />
        </div>

        <MultiSelect label="Courses" items={courses} selected={selectedCourses} setSelected={setSelectedCourses} />
        <MultiSelect label="Resources" items={resources} selected={selectedResources} setSelected={setSelectedResources} />

        <div className="text-sm font-medium dark:text-white">
          Original Price: <span className="font-bold">Rs {originalPrice}</span>
        </div>

        <div>
          <Label className="block text-sm mb-1 ">Bundle Price *</Label>
          <Input
            type="number"
            value={discountedPrice}
            onChange={(e) => setDiscountedPrice(e.target.value)}
            className="w-full border text-sm "
            required
          />
        </div>

        <Button
          className="w-full"
          variant={'default'}
        >
          {loading ? "Creating..." : "Create Bundle"}
        </Button>
      </form>
    </div>
  );
}
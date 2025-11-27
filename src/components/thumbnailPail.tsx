"use client";

// Define interface for the items
interface ThumbnailItem {
  thumbnail: string | null;
  title: string;
}

// This component displays a "pile" of thumbnails for bundles
// that don't have their own single thumbnail.

export const BundleThumbnailPile = ({ items }: { items: ThumbnailItem[] }) => {
  const placeholder = "/placeholder.jpg";
  // Get the first 3 items, or fewer if not available
  const displayItems = items.slice(0, 3);

  if (displayItems.length === 0) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gray-100 dark:bg-neutral-800 rounded-md">
        <p className="text-xs text-gray-400">No items in bundle</p>
      </div>
    );
  }

  // We add a 'group' class to the parent div so we can
  // change the pile animation on hover.
  return (
    <div className="relative w-full h-full">
      {/* Base card, always present if items exist */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={displayItems[0]?.thumbnail || placeholder}
        alt={displayItems[0]?.title}
        className="absolute top-0 left-0 w-full h-full object-cover rounded-md shadow-sm z-10"
        onError={(e) => (e.currentTarget.src = placeholder)}
      />
      {/* Second card, rotated */}
      {displayItems[1] && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={displayItems[1]?.thumbnail || placeholder}
          alt={displayItems[1]?.title}
          className="absolute top-0 left-2 w-[calc(100%-16px)] h-full object-cover rounded-md shadow-md z-20 transform rotate-2 transition-transform group-hover:rotate-0"
          onError={(e) => (e.currentTarget.src = placeholder)}
        />
      )}
      {/* Top card, rotated other way */}
      {displayItems[2] && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={displayItems[2]?.thumbnail || placeholder}
          alt={displayItems[2]?.title}
          className="absolute top-0 left-4 w-[calc(100%-32px)] h-full object-cover rounded-md shadow-lg z-30 transform -rotate-3 transition-transform group-hover:rotate-0"
          onError={(e) => (e.currentTarget.src = placeholder)}
        />
      )}
    </div>
  );
};
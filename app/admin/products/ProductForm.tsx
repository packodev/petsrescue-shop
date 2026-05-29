"use client";

import { useFormState, useFormStatus } from "react-dom";
import { saveProductAction, type ProductFormState } from "../actions";
import { parseImages } from "@/lib/product";

type Category = { id: string; name: string };

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAt: number | null;
  stock: number;
  image: string;
  images: string;
  categoryId: string;
  active: boolean;
  featured: boolean;
  supplierUrl: string | null;
};

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending ? "Saving..." : isEdit ? "Save changes" : "Create product"}
    </button>
  );
}

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const [state, action] = useFormState<ProductFormState, FormData>(
    saveProductAction,
    undefined,
  );

  return (
    <form action={action} className="card space-y-4 p-6">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={product?.name}
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="slug">Slug</label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            defaultValue={product?.slug}
            pattern="[a-z0-9-]+"
            className="input"
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          defaultValue={product?.description}
          className="input"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="label" htmlFor="price">Price (USD)</label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={product?.price}
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="compareAt">Compare at (optional)</label>
          <input
            id="compareAt"
            name="compareAt"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.compareAt ?? ""}
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="stock">Stock</label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            required
            defaultValue={product?.stock ?? 100}
            className="input"
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="image">Main image URL</label>
        <input
          id="image"
          name="image"
          type="url"
          required
          defaultValue={product?.image}
          className="input"
          placeholder="https://i.imgur.com/abc.jpeg"
        />
        <p className="mt-1 text-xs text-ink-400">
          Shown on the shop list card. Use a 4:3 image (e.g. 1600×1200).
        </p>
      </div>

      <div>
        <label className="label" htmlFor="extraImages">
          Additional images (one URL per line)
        </label>
        <textarea
          id="extraImages"
          name="extraImages"
          rows={4}
          defaultValue={parseImages(product?.images).join("\n")}
          className="input"
          placeholder="https://i.imgur.com/abc.jpeg&#10;https://i.imgur.com/def.jpeg"
        />
        <p className="mt-1 text-xs text-ink-400">
          Shown as a swipeable carousel on the product detail page. Include
          the main image again as the first line if you want it to appear in
          the carousel too.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="categoryId">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={product?.categoryId ?? ""}
            className="input"
          >
            <option value="" disabled>Select…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="supplierUrl">Supplier URL (optional)</label>
          <input
            id="supplierUrl"
            name="supplierUrl"
            type="url"
            defaultValue={product?.supplierUrl ?? ""}
            placeholder="https://aliexpress.com/item/..."
            className="input"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="active"
            defaultChecked={product?.active ?? true}
          />
          Active (visible on store)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product?.featured ?? false}
          />
          Featured on homepage
        </label>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton isEdit={!!product} />
    </form>
  );
}

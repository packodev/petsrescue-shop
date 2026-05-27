"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  saveVariantAction,
  deleteVariantAction,
  type VariantFormState,
} from "../../actions";

type Variant = {
  id: string;
  productId: string;
  name: string;
  image: string;
  priceOverride: number | null;
  stock: number;
  sortOrder: number;
};

function Save() {
  const { pending } = useFormStatus();
  return (
    <button className="btn-primary" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </button>
  );
}

function Delete() {
  const { pending } = useFormStatus();
  return (
    <button
      className="text-xs text-red-600 hover:underline"
      disabled={pending}
      type="submit"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}

export function VariantRow({ variant }: { variant: Variant }) {
  const [state, action] = useFormState<VariantFormState, FormData>(
    saveVariantAction,
    undefined,
  );

  return (
    <div className="space-y-2">
      <form action={action} className="grid grid-cols-2 gap-2 md:grid-cols-6">
        <input type="hidden" name="id" value={variant.id} />
        <input type="hidden" name="productId" value={variant.productId} />
        <input
          name="name"
          defaultValue={variant.name}
          className="input md:col-span-2"
          placeholder="Variant name"
          required
        />
        <input
          name="image"
          type="url"
          defaultValue={variant.image}
          className="input md:col-span-2"
          placeholder="Image URL"
          required
        />
        <input
          name="priceOverride"
          type="number"
          step="0.01"
          defaultValue={variant.priceOverride ?? ""}
          className="input"
          placeholder="Price"
        />
        <input
          name="stock"
          type="number"
          min="0"
          defaultValue={variant.stock}
          className="input"
          placeholder="Stock"
          required
        />
        <input type="hidden" name="sortOrder" value={variant.sortOrder} />
        <div className="col-span-2 flex items-center justify-between gap-3 md:col-span-6">
          {state?.error && (
            <span className="text-xs text-red-600">{state.error}</span>
          )}
          <div className="ml-auto flex items-center gap-3">
            <Save />
          </div>
        </div>
      </form>
      <form action={deleteVariantAction} className="text-right">
        <input type="hidden" name="id" value={variant.id} />
        <input type="hidden" name="productId" value={variant.productId} />
        <Delete />
      </form>
    </div>
  );
}

"use client";

import { useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { saveVariantAction, type VariantFormState } from "../../actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button className="btn-primary" disabled={pending}>
      {pending ? "Adding..." : "Add variant"}
    </button>
  );
}

export function NewVariantForm({ productId }: { productId: string }) {
  const [state, action] = useFormState<VariantFormState, FormData>(
    saveVariantAction,
    undefined,
  );
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        const result = await action(fd);
        if (!result?.error) formRef.current?.reset();
      }}
      className="card grid grid-cols-2 gap-2 p-4 md:grid-cols-6"
    >
      <input type="hidden" name="productId" value={productId} />
      <input
        name="name"
        className="input md:col-span-2"
        placeholder="Variant name (e.g. Labrador Motif)"
        required
      />
      <input
        name="image"
        type="url"
        className="input md:col-span-2"
        placeholder="Image URL"
        required
      />
      <input
        name="priceOverride"
        type="number"
        step="0.01"
        className="input"
        placeholder="Price (optional)"
      />
      <input
        name="stock"
        type="number"
        min="0"
        defaultValue={100}
        className="input"
        placeholder="Stock"
        required
      />
      <input type="hidden" name="sortOrder" defaultValue={0} />
      <div className="col-span-2 flex items-center justify-between gap-3 md:col-span-6">
        {state?.error && (
          <span className="text-xs text-red-600">{state.error}</span>
        )}
        <div className="ml-auto">
          <Submit />
        </div>
      </div>
    </form>
  );
}

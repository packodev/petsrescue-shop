"use client";

import { deleteOrderAction } from "../../actions";

export function DeleteOrderButton({ orderId }: { orderId: string }) {
  return (
    <form
      action={deleteOrderAction}
      onSubmit={(e) => {
        if (!confirm("Delete this order? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={orderId} />
      <button
        type="submit"
        className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
      >
        Delete order
      </button>
    </form>
  );
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, stockTransactions, systemLogs } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    let query = db.select().from(stockTransactions).orderBy(desc(stockTransactions.transactionDate));

    if (productId) {
      const records = await query;
      const filtered = records.filter((t) => t.productId.toLowerCase() === productId.toLowerCase());
      return NextResponse.json({ success: true, transactions: filtered });
    }

    const allTx = await query;
    return NextResponse.json({ success: true, transactions: allTx });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, transactionType, quantity, notes } = body;

    if (!productId || typeof productId !== "string") {
      return NextResponse.json({ success: false, error: "Product ID is required." }, { status: 400 });
    }

    const type = transactionType?.toUpperCase();
    if (!["RECEIVE", "ISSUE", "ADJUSTMENT"].includes(type)) {
      return NextResponse.json(
        { success: false, error: "Transaction type must be RECEIVE, ISSUE, or ADJUSTMENT." },
        { status: 400 }
      );
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return NextResponse.json(
        { success: false, error: "Quantity must be a positive whole number greater than 0." },
        { status: 400 }
      );
    }

    const cleanProductId = productId.trim().toUpperCase();

    // Fetch product
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.productId, cleanProductId))
      .limit(1);

    if (!product) {
      return NextResponse.json(
        { success: false, error: `Product with ID '${cleanProductId}' not found in inventory.` },
        { status: 404 }
      );
    }

    const previousStock = product.quantity;
    let updatedStock = previousStock;

    if (type === "RECEIVE") {
      updatedStock = previousStock + qty;
    } else if (type === "ISSUE") {
      // Validate available stock! Prevent negative stock!
      if (qty > previousStock) {
        return NextResponse.json(
          {
            success: false,
            error: `Insufficient stock! Cannot issue/sell ${qty} units. Current stock is only ${previousStock} units. (Stock would become negative: ${
              previousStock - qty
            })`,
          },
          { status: 400 }
        );
      }
      updatedStock = previousStock - qty;
    } else if (type === "ADJUSTMENT") {
      // Adjustment can be handled or set
      updatedStock = qty; // direct adjustment to qty
    }

    // Atomic update
    await db
      .update(products)
      .set({
        quantity: updatedStock,
        updatedAt: new Date(),
      })
      .where(eq(products.id, product.id));

    const transactionId = `TXN-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const [newTx] = await db
      .insert(stockTransactions)
      .values({
        transactionId,
        productId: cleanProductId,
        productName: product.productName,
        transactionType: type,
        quantity: qty,
        previousStock,
        updatedStock,
        notes: notes?.trim() || `${type} operation for ${product.productName}`,
      })
      .returning();

    await db.insert(systemLogs).values({
      action: `STOCK_${type}`,
      module: "INVENTORY",
      details: `${type} ${qty} units of ${product.productName} (${cleanProductId}). Stock: ${previousStock} -> ${updatedStock}`,
    });

    return NextResponse.json({
      success: true,
      transaction: newTx,
      updatedProduct: {
        ...product,
        quantity: updatedStock,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export interface StudentRecord {
  id: number;
  registrationNumber: string;
  fullName: string;
  cat1: number;
  cat2: number;
  examination: number;
  totalScore: number;
  grade: string;
  status: string;
  createdAt?: string | Date;
}

export interface ProductRecord {
  id: number;
  productId: string;
  productName: string;
  category: string;
  unitPrice: number;
  quantity: number;
  createdAt?: string | Date;
}

export interface LinearSearchStep<T> {
  index: number;
  item: T;
  comparedValue: string;
  targetValue: string;
  isMatch: boolean;
  notes: string;
}

export interface BinarySearchStep {
  step: number;
  low: number;
  high: number;
  mid: number;
  midItem: ProductRecord;
  target: string;
  comparisonResult: "LESS" | "GREATER" | "EQUAL";
  notes: string;
}

export interface BubbleSortStep {
  stepNumber: number;
  pass: number;
  indexA: number;
  indexB: number;
  itemAId: string;
  itemBId: string;
  swapped: boolean;
  currentArray: ProductRecord[];
  notes: string;
}

/**
 * SOEN 105 Requirement: Linear Search Algorithm on Students by registration number
 */
export function linearSearchStudents(
  list: StudentRecord[],
  targetRegNo: string
): {
  found: boolean;
  result: StudentRecord | null;
  steps: LinearSearchStep<StudentRecord>[];
  totalComparisons: number;
} {
  const steps: LinearSearchStep<StudentRecord>[] = [];
  const normalizedTarget = targetRegNo.trim().toUpperCase();

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const itemReg = item.registrationNumber.trim().toUpperCase();
    const isMatch = itemReg === normalizedTarget;

    steps.push({
      index: i,
      item,
      comparedValue: item.registrationNumber,
      targetValue: targetRegNo,
      isMatch,
      notes: isMatch
        ? `Match found at index [${i}]! Student "${item.fullName}" (${item.registrationNumber})`
        : `Index [${i}]: '${item.registrationNumber}' != '${targetRegNo}', continue searching sequentially.`,
    });

    if (isMatch) {
      return {
        found: true,
        result: item,
        steps,
        totalComparisons: i + 1,
      };
    }
  }

  return {
    found: false,
    result: null,
    steps,
    totalComparisons: list.length,
  };
}

/**
 * SOEN 105 Requirement: Linear Search Algorithm on Products by Product ID
 */
export function linearSearchProducts(
  list: ProductRecord[],
  targetProductId: string
): {
  found: boolean;
  result: ProductRecord | null;
  steps: LinearSearchStep<ProductRecord>[];
  totalComparisons: number;
} {
  const steps: LinearSearchStep<ProductRecord>[] = [];
  const normalizedTarget = targetProductId.trim().toUpperCase();

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const itemId = item.productId.trim().toUpperCase();
    const isMatch = itemId === normalizedTarget;

    steps.push({
      index: i,
      item,
      comparedValue: item.productId,
      targetValue: targetProductId,
      isMatch,
      notes: isMatch
        ? `Sequential match found at index [${i}]! Product "${item.productName}"`
        : `Index [${i}]: '${item.productId}' does not match '${targetProductId}'. Move to next element.`,
    });

    if (isMatch) {
      return {
        found: true,
        result: item,
        steps,
        totalComparisons: i + 1,
      };
    }
  }

  return {
    found: false,
    result: null,
    steps,
    totalComparisons: list.length,
  };
}

/**
 * SOEN 105 Requirement: Binary Search Algorithm on Products by Product ID
 * Requires sorted array by Product ID in ascending order.
 */
export function binarySearchProducts(
  sortedList: ProductRecord[],
  targetProductId: string
): {
  found: boolean;
  result: ProductRecord | null;
  steps: BinarySearchStep[];
  totalComparisons: number;
} {
  const steps: BinarySearchStep[] = [];
  const target = targetProductId.trim().toUpperCase();

  let low = 0;
  let high = sortedList.length - 1;
  let stepCount = 0;

  while (low <= high) {
    stepCount++;
    const mid = Math.floor((low + high) / 2);
    const midItem = sortedList[mid];
    const midId = midItem.productId.trim().toUpperCase();

    if (midId === target) {
      steps.push({
        step: stepCount,
        low,
        high,
        mid,
        midItem,
        target,
        comparisonResult: "EQUAL",
        notes: `Target '${target}' matches mid item at index [${mid}] (${midItem.productName})! Search terminated.`,
      });
      return {
        found: true,
        result: midItem,
        steps,
        totalComparisons: stepCount,
      };
    } else if (midId < target) {
      steps.push({
        step: stepCount,
        low,
        high,
        mid,
        midItem,
        target,
        comparisonResult: "LESS",
        notes: `Mid item '${midId}' < Target '${target}'. Target lies in right partition. Updating low = mid + 1 (${mid + 1}).`,
      });
      low = mid + 1;
    } else {
      steps.push({
        step: stepCount,
        low,
        high,
        mid,
        midItem,
        target,
        comparisonResult: "GREATER",
        notes: `Mid item '${midId}' > Target '${target}'. Target lies in left partition. Updating high = mid - 1 (${mid - 1}).`,
      });
      high = mid - 1;
    }
  }

  return {
    found: false,
    result: null,
    steps,
    totalComparisons: stepCount,
  };
}

/**
 * SOEN 105 Requirement: Bubble Sort Algorithm
 * Sorts products by Product ID in ascending order.
 */
export function bubbleSortProducts(
  originalList: ProductRecord[]
): {
  sortedList: ProductRecord[];
  steps: BubbleSortStep[];
  totalPasses: number;
  totalComparisons: number;
  totalSwaps: number;
} {
  const arr = originalList.map((item) => ({ ...item }));
  const n = arr.length;
  const steps: BubbleSortStep[] = [];
  let totalComparisons = 0;
  let totalSwaps = 0;
  let stepNumber = 0;

  for (let pass = 0; pass < n - 1; pass++) {
    let swappedInThisPass = false;

    for (let j = 0; j < n - pass - 1; j++) {
      totalComparisons++;
      stepNumber++;

      const a = arr[j];
      const b = arr[j + 1];
      const aId = a.productId.trim().toUpperCase();
      const bId = b.productId.trim().toUpperCase();

      let didSwap = false;
      if (aId > bId) {
        // Swap
        arr[j] = b;
        arr[j + 1] = a;
        didSwap = true;
        swappedInThisPass = true;
        totalSwaps++;
      }

      steps.push({
        stepNumber,
        pass: pass + 1,
        indexA: j,
        indexB: j + 1,
        itemAId: a.productId,
        itemBId: b.productId,
        swapped: didSwap,
        currentArray: arr.map((x) => ({ ...x })),
        notes: didSwap
          ? `Pass ${pass + 1}: '${a.productId}' > '${b.productId}' -> Swapped positions ${j} and ${j + 1}.`
          : `Pass ${pass + 1}: '${a.productId}' <= '${b.productId}' -> Ordered correctly, no swap.`,
      });
    }

    // Optimization: if no two elements were swapped by inner loop, then array is already sorted
    if (!swappedInThisPass) {
      break;
    }
  }

  return {
    sortedList: arr,
    steps,
    totalPasses: steps.length > 0 ? steps[steps.length - 1].pass : 0,
    totalComparisons,
    totalSwaps,
  };
}

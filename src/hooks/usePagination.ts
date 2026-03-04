// src/hooks/usePagination.ts
import { useMemo } from "react";

export const DOTS = "...";

interface UsePaginationProps {
  totalCount: number;
  pageSize: number;
  siblingCount?: number;
  currentPage: number;
}

const range = (start: number, end: number): (number | string)[] => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export const usePagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage,
}: UsePaginationProps) => {
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize);

    // Jumlah elemen yang ingin kita tampilkan di bar navigasi:
    // siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    // Kita gunakan formula standar: siblingCount * 2 + 5
    const totalPageNumbers = siblingCount + 5;

    /*
      KASUS 1:
      Jika jumlah total halaman lebih kecil dari jumlah nomor yang ingin ditampilkan,
      tampilkan semua nomor halaman tanpa DOTS.
    */
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    // Hitung posisi index sibling
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount,
    );

    /*
      Tampilkan DOTS jika selisih antara sibling dan index pertama/terakhir > 2
    */
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    /*
      KASUS 2: Hanya DOTS sebelah KANAN
      [1, 2, 3, 4, 5, ..., 20]
    */
    if (!shouldShowLeftDots && shouldShowRightDots) {
      // 3 (first + margin) + 2 * sibling
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }

    /*
      KASUS 3: Hanya DOTS sebelah KIRI
      [1, ..., 16, 17, 18, 19, 20]
    */
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount,
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    /*
      KASUS 4: DOTS di KEDUA sisi
      [1, ..., 7, 8, 9, ..., 20]
    */
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    return [];
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
};

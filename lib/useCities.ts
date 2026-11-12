"use client";

import { useCallback, useMemo, useState } from "react";
import { getCity, searchCities, type City } from "@/lib/cities";

/**
 * Favourites and the board layout.
 *
 * The board is five rows deep. The user can star any city in the catalogue
 * and reorder the board freely; both are persisted with the rest of the
 * preferences.
 */

/** The board has exactly five rows, matching the LED matrix. */
export const MAX_BOARD_ROWS = 5;

export interface CitiesState {
  /** The cities on the board, in display order. */
  board: City[];
  /** The user's starred cities, in the order they were starred. */
  favourites: City[];
  /** Whether a city is starred. */
  isFavourite: (id: string) => boolean;
  /** Star or unstar a city. */
  toggleFavourite: (id: string) => void;
  /** Put a city on the board, replacing the last row if it is full. */
  putOnBoard: (id: string) => void;
  /** Move a board row up (-1) or down (+1). */
  moveBoardRow: (index: number, delta: number) => void;
  /** Take a city off the board. */
  removeBoardRow: (index: number) => void;
  /** Search the whole catalogue for cities to add. */
  search: (query: string) => City[];
  /** The query in the add-city field. */
  query: string;
  setQuery: (value: string) => void;
}

export function useCities(
  boardCityIds: string[],
  favouriteCityIds: string[],
  onBoardChange: (ids: string[]) => void,
  onFavouritesChange: (ids: string[]) => void,
): CitiesState {
  const [query, setQuery] = useState("");

  const board = useMemo(
    () =>
      boardCityIds
        .map((id) => getCity(id))
        .filter((city): city is City => Boolean(city)),
    [boardCityIds],
  );

  const favourites = useMemo(
    () =>
      favouriteCityIds
        .map((id) => getCity(id))
        .filter((city): city is City => Boolean(city)),
    [favouriteCityIds],
  );

  const isFavourite = useCallback(
    (id: string) => favouriteCityIds.includes(id),
    [favouriteCityIds],
  );

  const toggleFavourite = useCallback(
    (id: string) => {
      if (favouriteCityIds.includes(id)) {
        onFavouritesChange(favouriteCityIds.filter((f) => f !== id));
      } else {
        onFavouritesChange([...favouriteCityIds, id]);
      }
    },
    [favouriteCityIds, onFavouritesChange],
  );

  const putOnBoard = useCallback(
    (id: string) => {
      if (boardCityIds.includes(id)) {
        // Already on the board — leave the running order untouched.
        onBoardChange(boardCityIds);
        return;
      }
      // The board is five rows deep. A new city takes the last slot,
      // exactly like the reference.
      const next = [...boardCityIds];
      if (next.length >= MAX_BOARD_ROWS) {
        next[next.length - 1] = id;
      } else {
        next.push(id);
      }
      onBoardChange(next);
    },
    [boardCityIds, onBoardChange],
  );

  const moveBoardRow = useCallback(
    (index: number, delta: number) => {
      const target = index + delta;
      if (index < 0 || target < 0 || target >= boardCityIds.length) return;
      const next = [...boardCityIds];
      const [row] = next.splice(index, 1);
      next.splice(target, 0, row);
      onBoardChange(next);
    },
    [boardCityIds, onBoardChange],
  );

  const removeBoardRow = useCallback(
    (index: number) => {
      if (index < 0 || index >= boardCityIds.length) return;
      onBoardChange(boardCityIds.filter((_, i) => i !== index));
    },
    [boardCityIds, onBoardChange],
  );

  const search = useCallback((value: string) => {
    const trimmed = value.trim();
    if (trimmed.length === 0) return [];
    return searchCities(trimmed, 8);
  }, []);

  return {
    board,
    favourites,
    isFavourite,
    toggleFavourite,
    putOnBoard,
    moveBoardRow,
    removeBoardRow,
    search,
    query,
    setQuery,
  };
}

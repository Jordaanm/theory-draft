import { Coords } from './stores/types';

export const BOARD_WIDTH = 7;
export const BOARD_HEIGHT = 3;

export const getIndexForCoords = (x: number, y: number): number => {
    return y * BOARD_WIDTH + x;
}

export const getCoordsForIndex = (index: number): Coords => {
    return {
        x: index % BOARD_WIDTH,
        y: Math.floor(index / BOARD_WIDTH)
    };
}
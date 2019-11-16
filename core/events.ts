import * as React from 'react';

export type ClickEvent = React.MouseEvent<HTMLElement, MouseEvent>;
export type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type EventHandler<T> = (e: T) => void;

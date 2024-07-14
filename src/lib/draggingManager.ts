import { writable, get, type Writable } from "svelte/store";


export const enum TriggerableElements {
    TRACK_DISPOSAL_ELEMENT = 'track-disposal-element',
    NOW_PLAYING_ELEMENT = 'now-playing-element',
}


export class DraggingManager {
    registeredElementsStore: Writable<HTMLElement[]>;
    triggeredElementStore: Writable<HTMLElement | undefined>;
    draggedElementStore: Writable<HTMLElement | undefined>;

    constructor() {
        this.registeredElementsStore = writable<HTMLElement[]>([]);
        this.triggeredElementStore = writable<HTMLElement | undefined>(undefined);
        this.draggedElementStore = writable<HTMLElement | undefined>(undefined);
    }

    registerElement(element: HTMLElement) {
        this.registeredElementsStore.update((arr) => {
            arr.push(element);
            return arr;
        })
    }

    setTriggeredElement(element: HTMLElement | undefined) {
        this.triggeredElementStore.set(element);
    }

    getTriggeredElement(): HTMLElement | undefined {
        return get(this.triggeredElementStore);
    }

    setDraggedElement(element: HTMLElement | undefined) {
        this.draggedElementStore.set(element);
    }

    getDraggedElement(): HTMLElement | undefined {
        return get(this.draggedElementStore);
    }

    checkForInteractionTrigger(event: MouseEvent) {
        const interactedElement = this.getElementByLocation(event.clientX, event.clientY);
        this.setTriggeredElement(interactedElement);
        this.setTriggeredElement(undefined);
    }

    private getElementByLocation(x:number, y:number): HTMLElement | undefined {
        const boundedElements = get(this.registeredElementsStore).filter((el) => {
            const offsetBottom = el.offsetTop + el.offsetHeight;
            const offsetRight = el.offsetLeft + el.offsetWidth;
            return x >= el.offsetLeft && x <= offsetRight && y >= el.offsetTop && y <= offsetBottom;
        });
        return boundedElements.at(0);
    }
}


export const globalDraggingManager = new DraggingManager();

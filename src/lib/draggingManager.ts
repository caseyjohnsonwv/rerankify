import { writable, get, type Writable } from "svelte/store";


export const enum TriggerableElements {
    TRACK_DISPOSAL_ELEMENT = 'track-disposal-element',
    NOW_PLAYING_ELEMENT = 'now-playing-element',
    CANVAS_ROOT_ELEMENT = 'canvas-root-element',
}


export class DraggingManager {
    registeredElementsStore: Writable<HTMLElement[]>;
    triggeredElementStore: Writable<HTMLElement | undefined>;
    draggedElementStore: Writable<HTMLElement | undefined>;
    dragEventStore: Writable<DragEvent | undefined>;

    canvasMinX: number;
    canvasMinY: number;

    constructor() {
        this.registeredElementsStore = writable<HTMLElement[]>([]);
        this.triggeredElementStore = writable<HTMLElement | undefined>(undefined);
        this.draggedElementStore = writable<HTMLElement | undefined>(undefined);
        this.dragEventStore = writable<DragEvent | undefined>(undefined);

        this.canvasMinX = 0;
        this.canvasMinY = 0;
    }

    registerElement(element: HTMLElement) {
        if (element.id === TriggerableElements.CANVAS_ROOT_ELEMENT) {
            this.canvasMinX = element.offsetLeft;
            this.canvasMinY = element.offsetTop;   
        }
        this.registeredElementsStore.update((arr) => {
            arr.push(element);
            return arr;
        })
    }

    getRegisteredElementById(id: string): HTMLElement | undefined {
        return get(this.registeredElementsStore).find((item) => item.id === id);
    }

    unregisterElementById(id: string) {
        this.registeredElementsStore.update((arr) => {
            return arr.filter((item) => item.id !== id);
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

    setDragEvent(event: DragEvent | undefined) {
        this.dragEventStore.set(event);
    }

    getDragEvent(): DragEvent | undefined {
        return get(this.dragEventStore);
    }

    checkForInteractionTrigger(event: DragEvent) {
        this.setDragEvent(event);
        const interactedElement = this.getElementByLocation(event.clientX, event.clientY);
        this.setTriggeredElement(interactedElement);
        this.setDragEvent(undefined);
        this.setDraggedElement(undefined);
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

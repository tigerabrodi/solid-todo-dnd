import { Component, createSignal, For } from "solid-js";
import {
  DragDropContext,
  DragDropSensors,
  DragOverlay,
  SortableContext,
  createSortable,
  closestLayoutCenter,
} from "@thisbeyond/solid-dnd";
import { v4 } from "uuid";

type Task = {
  id: string;
  value: string;
};

const Sortable: Component<{ item: Task; handleDelete: (id: string) => void }> =
  (props) => {
    const sortable = createSortable({ id: props.item }) as any;
    return (
      <li
        className={`px-2 mt-10 min-w-[100px] flex items-center justify-center gap-5 ${
          sortable.isActiveDraggable ? "opacity-25" : "opacity-100"
        }`}
      >
        <h2 className="text-xl text-white">{props.item.value}</h2>
        <button
          type="button"
          className="bg-white text-blue px-4 py-2"
          onClick={() => props.handleDelete(props.item.id)}
        >
          Delete
        </button>
      </li>
    );
  };

export const Home: Component = () => {
  const [tasks, setTasks] = createSignal<Task[]>([]);
  const [inputValue, setInputValue] = createSignal<string>("");
  const [activeTask, setActiveTask] = createSignal<Task | null>(null);

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    setTasks([...tasks(), { id: v4(), value: inputValue() }]);
    setInputValue("");
  };

  const handleDelete = (id: string) => {
    const newTasks = tasks().filter((task) => task.id !== id);
    setTasks(newTasks);
  };

  const ids = () => tasks();

  const onDragStart = ({ draggable }: { draggable: { id: Task } }) =>
    setActiveTask(draggable.id);

  const onDragEnd = ({
    draggable,
    droppable,
  }: {
    draggable: { id: Task };
    droppable: { id: Task };
  }) => {
    if (draggable && droppable) {
      const currentItems = ids();
      const fromIndex = currentItems.indexOf(draggable.id);
      const toIndex = currentItems.indexOf(droppable.id);
      if (fromIndex !== toIndex) {
        const updatedItems = currentItems.slice();
        updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));
        setTasks(updatedItems);
      }
    }
    setActiveTask(null);
  };

  return (
    <main className="flex flex-col items-center">
      <h1 className="text-2xl mt-10">Todo</h1>
      <form
        className="flex items-center gap-5 justify-center mt-12"
        onSubmit={(event) => handleSubmit(event)}
      >
        <label htmlFor="task" className="sr-only">
          task
        </label>
        <input
          type="text"
          id="task"
          className="w-40 bg-white text-blue h-10 rounded-sm shadow-sm shadow-gray-700"
          value={inputValue()}
          onChange={(event) =>
            setInputValue((event.target as HTMLInputElement).value)
          }
        />
        <button type="submit" className="bg-white text-blue px-4 py-2">
          Add
        </button>
      </form>

      <DragDropContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        collisionDetectionAlgorithm={closestLayoutCenter}
      >
        <DragDropSensors />
        <SortableContext ids={ids()}>
          <For each={tasks()}>
            {(item) => <Sortable item={item} handleDelete={handleDelete} />}
          </For>
        </SortableContext>
        <DragOverlay>
          <div>{`Sortable ${activeTask()}`}</div>
        </DragOverlay>
      </DragDropContext>
    </main>
  );
};

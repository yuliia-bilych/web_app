import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TaskModal from "../modals/TaskModal";

function Task({ colIndex, taskIndex }) {
  const dispatch = useDispatch();
  const [color, setColor] = useState(null);
  const [isOverdue, setIsOverdue] = useState(false);

  const boards = useSelector((state) => state.boards);
  const board = boards.find((board) => board.isActive === true);
  const columns = board.columns;
  const col = columns.find((col, i) => i === colIndex);
  const task = col.tasks.find((task, i) => i === taskIndex);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  useEffect(() => {
    // Генерація кольору на основі імені відповідальної особи
    const generatedColor = generateColorFromString(task.responsible);
    setColor(generatedColor);

    // Перевірка чи минув термін завершення задачі
    const currentDate = new Date();
    const endDate = new Date(task.endDate);
    setIsOverdue(currentDate > endDate);
  }, [task.responsible, task.endDate]);

  const generateColorFromString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return `hsl(${h}, 50%, 50%)`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  let completed = 0;
  let subtasks = task.subtasks;
  subtasks.forEach((subtask) => {
    if (subtask.isCompleted) {
      completed++;
    }
  });

  const handleOnDrag = (e) => {
    e.dataTransfer.setData(
      "text",
      JSON.stringify({ taskIndex, prevColIndex: colIndex })
    );
  };

  return (
    <div>
      <div
        onClick={() => {
          setIsTaskModalOpen(true);
        }}
        draggable
        onDragStart={handleOnDrag}
        className={`w-[280px] first:my-5 rounded-lg bg-white dark:bg-[#2b2c37] shadow-[#364e7e1a] py-6 px-3 shadow-lg hover:text-[#635fc7] dark:text-white dark:hover:text-[#635fc7] cursor-pointer ${isOverdue ? 'bg-red-300' : ''}`}
      >
        <p className="font-bold tracking-wide">{task.title}</p>
        <p className="font-bold text-xs tracking-tighter mt-2 text-gray-500">
          {completed} of {subtasks.length} completed tasks
        </p>
        <div className="font-bold flex tracking-wide items-center gap-2 md:tracking-[.2em]">
          <div className={`rounded-full w-1 h-4`} style={{ backgroundColor: color }} /> {task.responsible}
        </div>
        {task.endDate && (
          <div className="text-xs text-gray-500">Due: {formatDate(task.endDate)}</div>
        )}
      </div>
      {isTaskModalOpen && (
        <TaskModal
          colIndex={colIndex}
          taskIndex={taskIndex}
          setIsTaskModalOpen={setIsTaskModalOpen}
        />
      )}
    </div>
  );
}

export default Task;

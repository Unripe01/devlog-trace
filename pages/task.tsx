import React, { useState } from "react";
import { Task } from "./api/task";
import { useMutation, useQuery, useQueryClient } from "react-query";

/** 非同期でタスクを取得する関数 */
let go: boolean = false;
const old_fetchTasks: () => Promise<Task[]> = async () => {
  if (go) {
    const response = await fetch("api/task", { method: "GET" });
    return await response.json();
  }

  throw new Promise<void>((resolve) => {
    setTimeout(() => {
      go = true;
      resolve();
    }, 1000);
  });
};
const fetchTasks: () => Promise<Task[]> = async () => {
  const data = new Promise<Task[]>((resolve) => {
    setTimeout(async () => {
      const response = await fetch("api/task", { method: "GET" });
      const data = await response.json();
      resolve(data);
    }, 1000);
  });
  return await data;
};

/** タスクを完了させるハンドラ */
const doneTask = async (taskId: Task["id"]) => {
  await fetch("api/done", {
    method: "POST",
    body: JSON.stringify({ id: taskId }),
    headers: { "Content-Type": "application/json" },
  });
};

/* タスク一覧ページ */
const Task: React.FC = () => {
  const queryClient = useQueryClient(); //useQuery用コンテキスト
  const { data: tasks, isLoading } = useQuery("tasks", fetchTasks); // useQueryの第一引数はキャッシュデータのキーとして利用される
  const mutation = useMutation(doneTask, {
    onSuccess: () => {
      queryClient.invalidateQueries("tasks");
    },
  });
  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div>
      <h1>タスク一覧</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>なまえ</th>
            <th>状態</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tasks?.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.name}</td>
              <td>{task.status}</td>
              <td>
                <button onClick={() => mutation.mutate(task.id)}>Done!</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Task;

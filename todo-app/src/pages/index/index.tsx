import React, { useState, useEffect, useRef } from 'react';
import { View, Input, Button, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useLoad } from '@tarojs/taro'
import './index.scss'

interface TodoItem {
  id: number;
  title: string;
  done: boolean;
}

export default function Index () {
  useLoad(() => {
    console.log('Page loaded.')
  })

  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null)

  // 初始化加载本地存储
  useEffect(() => {
    try {
      const storedTodos = Taro.getStorageSync('todoList')
      if (storedTodos) {
        setTodos(storedTodos)
      }
    } catch (error) {
      console.warn('Failed to load todos from storage:', error)
    }
  }, [])

  // 每次 todoList 更新时保存到本地
  useEffect(() => {
    saveTodosToStorage(todos)
  }, [todos])

  // 保存数据
  const saveTodosToStorage = (todos: TodoItem[]) => {
    Taro.setStorageSync('todoList', todos)
  }

  const addTodo = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      Taro.showToast({ title: '请输入内容', icon: 'none' });
      return;
    }
    const newTodo: TodoItem = {
      id: Date.now(),
      title: trimmed,
      done: false,
    };
    setTodos([...todos, newTodo]);
    // saveTodosToStorage(todos)
    setInputValue('');
    inputRef.current?.focus()
  };

  const toggleTodo = (id: number) => {
    const updated = todos.map(item =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    setTodos(updated);
  };

  const removeTodo = (id: number) => {
    const filtered = todos.filter(item => item.id !== id);
    setTodos(filtered);
  };

  return (
    <View className="container">
      <View className="input-area">
        <Input
          className="input"
          type="text"
          value={inputValue}
          onInput={e => setInputValue(e.detail.value)}
          placeholder="添加一条待办事项"
          ref={inputRef}
        />
        <Button className="add-btn" onClick={addTodo}>添加</Button>
      </View>

      <View className="list">
        {todos.length === 0 ? (
          <Text className="empty">暂无待办事项</Text>
        ) : (
          todos.map(item => (
            <View
              key={item.id}
              className="todo-item"
              onClick={() => toggleTodo(item.id)}
            >
              <Text className={`todo-text ${item.done ? 'done' : ''}`}>{item.title}</Text>
              <Button
                className="delete-btn"
                size="mini"
                onClick={e => {
                  e.stopPropagation();
                  removeTodo(item.id);
                }}
              >
                删除
              </Button>
            </View>
          ))
        )}
      </View>
    </View>
  )
}

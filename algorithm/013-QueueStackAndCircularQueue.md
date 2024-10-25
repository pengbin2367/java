# 队列和栈——链表和数组实现

队列的介绍

栈的介绍

## 队列的链表实现

```java
// 直接用java内部的实现
// 其实内部就是双向链表，常数操作慢
public static class Queue1 {

  // java中的双向链表LinkedList
  // 单向链表就足够了
  public Queue<Integer> queue = new LinkedList<>();

  // 调用任何方法之前，先调用这个方法来判断队列内是否有东西
  public boolean isEmpty() {
    return queue.isEmpty();
  }

  // 向队列中加入num，加到尾巴	
  public void offer(int num) {
    queue.offer(num);
  }

  // 从队列拿，从头拿
  public int poll() {
    return queue.poll();
  }

  // 返回队列头的元素但是不弹出
  public int peek() {
    return queue.peek();
  }

  // 返回目前队列里有几个数
  public int size() {
    return queue.size();
  }

}
```



## 队列的数组实现

```java
// 实际刷题时更常见的写法，常数时间好
// 如果可以确定加入操作的总次数不超过n，那么可以用
// 一般笔试、面试都会有一个明确数据量，所以这是最常用的方式
public static class Queue2 {

  public int[] queue;
  public int l;
  public int r;

  // 加入操作的总次数上限是多少，一定要明确
  public Queue2(int n) {
    queue = new int[n];
    l = 0;
    r = 0;
  }

  // 调用任何方法之前，先调用这个方法来判断队列内是否有东西
  public boolean isEmpty() {
    return l == r;
  }

  public void offer(int num) {
    queue[r++] = num;
  }

  public int poll() {
    return queue[l++];
  }
  // ?
  // l...r-1 r
  // [l..r)
  public int head() {
    return queue[l];
  }

  public int tail() {
    return queue[r - 1];
  }

  public int size() {
    return r - l;
  }

}
```



## 栈的数组实现

```java
// 直接用java内部的实现
// 其实就是动态数组，不过常数时间并不好
public static class Stack1 {

  public Stack<Integer> stack = new Stack<>();

  // 调用任何方法之前，先调用这个方法来判断栈内是否有东西
  public boolean isEmpty() {
    return stack.isEmpty();
  }

  public void push(int num) {
    stack.push(num);
  }

  public int pop() {
    return stack.pop();
  }

  public int peek() {
    return stack.peek();
  }

  public int size() {
    return stack.size();
  }

}

// 实际刷题时更常见的写法，常数时间好
// 如果可以保证同时在栈里的元素个数不会超过n，那么可以用
// 也就是发生弹出操作之后，空间可以复用
// 一般笔试、面试都会有一个明确数据量，所以这是最常用的方式
public static class Stack2 {

  public int[] stack;
  public int size;

  // 同时在栈里的元素个数不会超过n
  public Stack2(int n) {
    stack = new int[n];
    size = 0;
  }

  // 调用任何方法之前，先调用这个方法来判断栈内是否有东西
  public boolean isEmpty() {
    return size == 0;
  }

  public void push(int num) {
    stack[size++] = num;
  }

  public int pop() {
    return stack[--size];
  }

  public int peek() {
    return stack[size - 1];
  }

  public int size() {
    return size;
  }

}
```



## 环形队列用数组实现

​		[641. 设计循环双端队列](https://leetcode.cn/problems/design-circular-deque/)

```java
class MyCircularDeque {

    int[] data;
    int left, right, size, limit;

    public MyCircularDeque(int k) {
        data = new int[k];
        left = right = size = 0;
        limit = k;
    }
    
    public boolean insertFront(int value) {
        if (isFull()) return false;
        if (isEmpty()) left = right = 0;
        else left = left == 0 ? limit - 1 : left - 1;
        data[left] = value;
        size++;
        return true;
    }
    
    public boolean insertLast(int value) {
        if (isFull()) return false;
        if (isEmpty())  left = right = 0;
        else right = right == limit - 1 ? 0 : right + 1;
        data[right] = value;
        size++;
        return true;
    }
    
    public boolean deleteFront() {
        if (isEmpty()) return false;
        left = left == limit - 1 ? 0 : left + 1;
        size--;
        return true;
    }
    
    public boolean deleteLast() {
        if (isEmpty()) return false;
        right = right == 0 ? limit - 1 : right - 1;
        size--;
        return true;
    }
    
    public int getFront() {
        if (isEmpty()) return -1;
        return data[left];
    }
    
    public int getRear() {
        if (isEmpty()) return -1;
        return data[right];
    }
    
    public boolean isEmpty() {
        return size == 0;
    }
    
    public boolean isFull() {
        return size == limit;
    }
}
```


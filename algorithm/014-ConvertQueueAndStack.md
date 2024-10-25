# 栈和队列的相互实现

## 栈实现队列

[232. 用栈实现队列](https://leetcode.cn/problems/implement-queue-using-stacks/)

```java
class MyQueue {

    Stack<Integer> in;
    Stack<Integer> out;

    public MyQueue() {
        in = new Stack<>();
        out = new Stack<>();
    }

    private void inToOut() {
        if (out.empty()) {
            while (!in.empty()) out.push(in.pop());
        }
    }
    
    public void push(int x) {
        in.push(x);
        inToOut();
    }
    
    public int pop() {
        inToOut();
        return out.pop();
    }
    
    public int peek() {
        inToOut();
        return out.peek();
    }
    
    public boolean empty() {
        return in.empty() && out.empty();
    }
}
```



## 队列实现栈

[225. 用队列实现栈](https://leetcode.cn/problems/implement-stack-using-queues/)

```java
class MyStack {

    Queue<Integer> queue;

    public MyStack() {
        queue = new LinkedList<Integer>();
    }
    
    public void push(int x) {
        int n = queue.size();
        queue.offer(x);
        for (int i = 0; i < n; i++) queue.offer(queue.poll());
    }
    
    public int pop() {
        return queue.poll();
    }
    
    public int top() {
        return queue.peek();
    }
    
    public boolean empty() {
        return queue.isEmpty();
    }
}
```


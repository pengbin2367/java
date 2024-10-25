# 最小栈

[155. 最小栈](https://leetcode.cn/problems/min-stack/)

```java
class MinStack {

    private final int MAXSIZE = 8001;
    private int[] data;
    private int[] min;
    private int size;

    public MinStack() {
        data = new int[MAXSIZE];
        min = new int[MAXSIZE];
        size = 0;
    }
    
    public void push(int val) {
        data[size] = val;
        if (size == 0 || min[size - 1] >= val) min[size] = val;
        else min[size] = min[size - 1];
        size++;
    }
    
    public void pop() {
        size--;
    }
    
    public int top() {
        return data[size - 1];
    }
    
    public int getMin() {
        return min[size - 1];
    }
}
```


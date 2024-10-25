# 	算法模板

[TOC]

## 对数器模板

:::details

```java
public class Validator {
    // 为了验证
    public static void main(String[] args) {
        // 随机数组最大长度
        int N = 200;
        // 随机数组每个值，在1~V之间等概率随机
        int V = 1000;
        // testTimes : 测试次数
        int testTimes = 50000;
        System.out.println("测试开始");
        for (int i = 0; i < testTimes; i++) {
            // 随机得到一个长度，长度在[0~N-1]
            int n = (int) (Math.random() * N);
            // 得到随机数组
            int[] arr = randomArray(n, V);
            int[] arr1 = copyArray(arr);
            int[] arr2 = copyArray(arr);
            int[] arr3 = copyArray(arr);
            selectionSort(arr1);
            bubbleSort(arr2);
            insertionSort(arr3);
            if (!sameArray(arr1, arr2) || !sameArray(arr1, arr3)) {
                System.out.println("出错了!");
                // 当有错了
                // 打印是什么例子，出错的
                // 打印三个功能，各自排序成了什么样
                // 可能要把例子带入，每个方法，去debug！
            }
        }
        System.out.println("测试结束");
    }

    // 为了验证
    // 得到一个随机数组，长度是n
    // 数组中每个数，都在1~v之间，随机得到
    public static int[] randomArray(int n, int v) {
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            // Math.random() -> double -> [0,1)范围山的一个小数，0.37463473126、0.001231231，等概率！
            // Math.random() * v -> double -> [0,v)一个小数，依然等概率
            // (int)(Math.random() * v) -> int -> 0 1 2 3 ... v-1，等概率的！
            // (int) (Math.random() * v) + 1 -> int -> 1 2 3 .... v，等概率的！
            arr[i] = (int) (Math.random() * v) + 1;
        }
        return arr;
    }

    // 为了验证
    public static int[] copyArray(int[] arr) {
        int n = arr.length;
        int[] ans = new int[n];
        for (int i = 0; i < n; i++) {
            ans[i] = arr[i];
        }
        return ans;
    }

    // 为了验证
    public static boolean sameArray(int[] arr1, int[] arr2) {
        int n = arr1.length;
        for (int i = 0; i < n; i++) {
            if (arr1[i] != arr2[i]) {
                return false;
            }
        }
        return true;
    }

    // 数组中交换i和j位置的数
    public static void swap(int[] arr, int i, int j) {
        int tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }

    // 选择排序
    public static void selectionSort(int[] arr) {
        if (arr == null || arr.length < 2) {
            return;
        }
        for (int minIndex, i = 0; i < arr.length - 1; i++) {
            minIndex = i;
            for (int j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }
            swap(arr, i, minIndex);
        }
    }

    // 冒泡排序
    public static void bubbleSort(int[] arr) {
        if (arr == null || arr.length < 2) {
            return;
        }
        for (int end = arr.length - 1; end > 0; end--) {
            for (int i = 0; i < end; i++) {
                if (arr[i] > arr[i + 1]) {
                    swap(arr, i, i + 1);
                }
            }
        }
    }

    // 插入排序
    public static void insertionSort(int[] arr) {
        if (arr == null || arr.length < 2) {
            return;
        }
        for (int i = 1; i < arr.length; i++) {
            for (int j = i - 1; j >= 0 && arr[j] > arr[j + 1]; j--) {
                swap(arr, j, j + 1);
            }
        }
    }
}
```

:::

## 输入输出模板

:::details 

```java
import java.util.*;
import java.io.*;

public class Main {
  public static void main(String[] args) throws IOException {
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    StreamTokenizer in = new StreamTokenizer(br);
    PrintWriter out = new PrintWriter(OutputStreamWriter(System.out));
    // 解析下一个标记
    in.nextToken();
    // 返回当前标记的数值 
    int n = (int) in.nval;
    // 返回当前标记的字符串 in.nextToken(); String str = in.sval;
    // TT_EOF/TT_EOL/TT_NUMBER/TT_WORD/TT_COMMENT 文件结尾/换行/数字/单词/注释
    while (in.nextToken() != StreamTokenizer.TT_EOF) {
      in.nextToken();
      int a = (int) in.nval;
    }
    out.println();
    // 将缓冲区数据强制立即刷入输出流
    out.flush();
    // 关闭输出流
    out.close();			
  }
}
```

:::

## 二分搜索

:::details 

```java
private int binarySearch(int[] nums, int target) {
  if (nums == null || nums.length == 0) return -1;
  int left = 0, right = nums.length - 1, mid = 0;
  while (left <= right) {
    mid = left + ((right - left) >> 1);
    if (nums[mid] == target) return mid;
    else if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
```

:::

## 先序遍历

:::details 

:::code-group

```java [递归版]
private void preOrder(TreeNode root) {
  if (root == null) return ;
  System.out.println(root.val);
  preOrder(root.left);
  preOrder(root.right);
}
```

```java [迭代版]
private void preOrder(TreeNode root) {
  if (root != null) {
    Stack<TreeNode> stack = new Stack<>();
    stack.push(root);
    while (!stack.isEmpty()) {
      root = stack.pop();
      System.out.println(root.val);
      if (root.right != null) stack.push(root.right);
      if (root.left != null) stack.push(root.left);
    }
  }
}
```

:::

## 中序遍历

:::details 

:::code-group

```java [递归版]
private void inOrder(TreeNode root) {
  if (root == null) return ;
  preOrder(root.left);
  System.out.println(root.val);
  preOrder(root.right);
}
```

```java [迭代版]
private void inOrder(TreeNode root) {
  if (root != null) {
    Stack<TreeNode> stack = new Stack<>();
    while (!stack.isEmpty() || root != null) {
      if (root != null) {
        stack.push(root);
        root = root.left;
      } else {
        root = stack.pop();
        System.out.println(root.val);
        root = root.right;
      }
    }
  }
}
```

:::

## 后序遍历

:::details 

:::code-group

```java [递归版]
private void postOrder(TreeNode root) {
  if (root == null) return ;
  preOrder(root.left);
  preOrder(root.right);
  System.out.println(root.val);
}
```

```java [两个栈]
// 借助栈的特性：入栈——中右左  出栈——左右中
private void postOrder(TreeNode root) {
  if (root != null) {
    Stack<TreeNode> stack = new Stack<>();
    Stack<TreeNode> collect = new Stack<>();
    stack.push(root);
    while (!stack.isEmpty()) {
      root = stack.pop();
      collect.push(root);
      if (root.left != null) stack.push(root.left);
      if (root.right != null) stack.push(root.right); 
    }
    while (!collect.isEmpty()) {
      System.out.println(collect.push().val);
    }
  }
}
```

```java [一个栈]
private void postOrder(TreeNode root) {
  if (root != null) {
    Stack<TreeNode> stack = new Stack<>();
    stack.push(root);
    while (!stack.isEmpty()) {
      TreeNode cur = stack.peek();
      if (cur.left != null && cur.left != root && cur.right != root) {
        stack.push(cur.left);
      } else if (cur.right != null && cur.right != root) {
        stack.push(cur.right);
      } else {
        System.out.println(cur.val);
        root = stack.pop();
      }
    }
  }
}
```

:::

## 归并排序

:::details 

:::code-group

```java [递归版]
private int MAXN = 50001;
private int[] help = new int[MAXN];

private void mergeSort(int[] nums) {
  mergeSort(nums, 0, nums.length - 1);
}

private void mergeSort(int[] nums, int left, int right) {
  if (left == right) return ;
  int mid = left + ((right - left) >> 1);
  mergeSort(nums, left, mid);
  mergeSort(nums, mid + 1, right);
  merge(nums, left, mid, right);
}

private void merge(int[] nums, int left, int mid, int right) {
  int i = left, a = left, b = mid + 1;
  while (a <= mid && b <= right) {
    help[i++] = nums[a] <= nums[b] ? nums[a++] : nums[b++];
  }
  while (a <= mid) {
    help[i++] = nums[a++];
  }
  while (b <= right) {
    help[i++] = nums[b++];
  }
  for (i = left; i <= right; i++) {
    nums[i] = help[i];
  }
}
```

```java [迭代版]
private int MAXN = 50001;
private int[] help = new int[MAXN];
// 以步长从一开始模拟分治，分治合并后步长 * 2
private void mergeSort(int[] nums) {
  for (int left = 0, mid = 0, right = 0, step = 1; step < MAXN; step <<= 1) {
    left = 0;
    while (left < MAXN) {
      mid = left + step - 1;
      if (right + 1 >= MAXN) break;
      right = Math.min(left + (step << 1) - 1, MAXN - 1);
      merge(nums, left, mid, right);
      left = right + 1;
    }
  }
}

private void merge(int[] nums, int left, int mid, int right) {
  int i = left, a = left, b = mid + 1;
  while (a <= mid && b <= right) {
    help[i++] = nums[a] <= nums[b] ? nums[a++] : nums[b++];
  }
  while (a <= mid) {
    help[i++] = nums[a++];
  }
  while (b <= right) {
    help[i++] = nums[b++];
  }
  for (i = left; i <= right; i++) {
    nums[i] = help[i];
  }
}
```

:::

## 随机快排

:::details 

:::code-group

```java [经典随机快排]
private void quickSort(int[] nums) {
  quickSort(nums, 0, nums.length - 1);
}

private void quickSort(int[] nums, int left, int right) {
  if (left >= right) return ;
  int x = nums[left + (int) (Math.random() * (right - left + 1))];
  int mid = partition(nums, left, right, x);
  quickSort(nums, left, mid - 1);
  quickSort(nums, mid + 1, right);
}

private int partition(int[] nums, int left, int right, int x) {
  int a = left, xi = 0;
  for (int i = left; i <= right; i++) {
    if (arr[i] <= x) {
      if (arr[i] == x) xi = a;
      swap(nums, a, i);
      a++;
    } 
  }
  swap(nums, a - 1, xi);
  return a - 1;
}

private void swap(int[] nums, int i, int j) {
  int temp = nums[i];
  nums[i] = nums[j];
  nums[j] = temp;
}
```

```java [荷兰国旗优化]
private int first, last;

private void quickSort(int[] nums) {
  quickSort(nums, 0, nums.length - 1);
}

private void quickSort(int[] nums, int left, int right) {
  if (left >= right) return ;
  int x = arr[left + (int)(Math.random() * (right -left + 1))];
  int mid = partition(nums, left, right, x);
  int l = first, r = last;
  quickSort(nums, left, l - 1);
  quickSort(nums, r + 1, right);
}

private int partition(int[] nums, int left, int right, int x) {
  first = left; last = right;
  int i = left;
  while (i <= last) {
    if (nums[i] == x) {
      i++;
    } else if (nums[i] < x) {
      swap(nums, i++, first++);
    } else {
      swap(nums, i, last--);
    }
  }
}

private void swap(int[] nums, int i, int j) {
  int temp = nums[i];
  nums[i] = nums[j];
  nums[j] = temp;
}
```

:::

## 冒泡排序

:::details 

```java
private void bubbleSort(int[] nums) {
  boolean flag;
  for (int i = 0; i < nums.length - 1; i++) {
    flag = true;
    for (int j = 0; j < nums.length - 1 - i; j++) {
      if (nums[j] > nums[j + 1]) {
        swap(nums, j, j + 1);
        flag = false;
      }
    }
    if (flag) break;
  }
}

private void swap(int[] nums, int i, int j) {
  int temp = nums[i];
  nums[i] = nums[j];
  nums[j] = temp;
}
```

:::

## 插入排序

:::details 

```java
private void insertSort(int[] nums) {
  for (int i = 1; i < nums.length; i++) {
    for (int j = i - 1; j >= 0; j--) {
      if (nums[j] < nums[j + 1]) {
        swap(nums, j, j + 1);
      }
    }
  }
}

private void swap(int[] nums, int i, int j) {
  int temp = nums[i];
  nums[i] = nums[j];
  nums[j] = temp;
}
```

:::

## 选择排序

:::details 

```java
private void selectSort(int[] nums) {
  for (int i = 0, minIndex = 0; i < nums.length - 1; i++, minIndex = i) {
    for (int j = i + 1; j < nums.length; j++) {
      if (nums[j] < nums[minIndex]) {
        minIndex = j;
      }
    }
    swap(nums, i, minIndex);
  }
}

private void swap(int[] nums, int i, int j) {
  int temp = nums[i];
  nums[i] = nums[j];
  nums[j] = temp;
}
```

:::

## 堆排序

:::details 

:::code-group

```java [自顶向下]
private void heapSort(int[] nums) {
  for (int i = 1; i < nums.length; i++) {
    heapInsert(nums, i);
  }
  int size = nums.length;
  while (size > 1) {
    swap(nums, 0, --size);
    heapify(nums, 0, size);
  }
}

private void heapInsert(int[] nums, int i) {
  while (nums[i] > nums[(i - 1) / 2]) {
    swap(nums, i, (i - 1) / 2);
    i = (i - 1) / 2;
  }
}

private void heapify(int[] nums, int index, int size) {
  int left = index << 1 + 1;
  while (left < size) {
    int best = left + 1 < size && nums[left] < nums[left + 1] ? left + 1 : left;
    best = nums[index] > nums[best] ? index : best;
    if (best == index) break;
    swap(nums, index, best);
    index = best;
    left = index << 1 + 1;
  }
}

private void swap(int[] nums, int i, int j) {
  int temp = nums[i];
  nums[i] = nums[j];
  nums[j] = temp;
}
```

```java [自底向上]
private void heapSort(int[] nums) {
  for (int i = nums.length - 1; i >= 0; i--) {
    heapify(nums, i, nums.length);
  }
  int size = nums.length;
  while (size > 1) {
    swap(nums, 0, --size);
    heapify(nums, 0, size);
  }
}

private void heapify(int[] nums, int index, int size) {
  int left = index << 1 + 1;
  while (left < size) {
    int best = left + 1 < size && nums[left] < nums[left + 1] ? left + 1 : left;
    best = nums[index] > nums[best] ? index : best;
    if (best == index) break;
    swap(nums, index, best);
    index = best;
    left = index << 1 + 1;
  }
}

private void swap(int[] nums, int i, int j) {
  int temp = nums[i];
  nums[i] = nums[j];
  nums[j] = temp;
}
```

:::

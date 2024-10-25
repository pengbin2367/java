# 选择、冒泡、插入排序

选择排序一句话：i~n-1 范围上，找到最小值并放在 i 位置，然后 i+1~n-1 范围上继续

冒泡排序一句话：0~i 范围上，相邻位置较大的数滚下去，最大值最终来到 i 位置，然后 0~i-1 范围上继续

插入排序一句话：0~i 范围上已经有序，新来的数从右到左滑到不再小的位置插入，然后继续

:::code-group

```java [testPre]
/**
     * 交换数组中两个元素的位置
     * @param arr   要操作的数组
     * @param i     要交换的元素位置
     * @param j     要交换的元素位置
     */
public static void swap(int[] arr, int i, int j) {
  int temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

public static int[] arr = { 34, 12, 3542, 234, 1, 546, 213 };

public static void print(int[] arr) {
  for (int i = 0; i < arr.length - 1; i++) {
    System.out.print(arr[i] + ", ");
  }
  System.out.println(arr[arr.length - 1]);
}
```

```java [选择排序]
// i~n-1 范围上，找到最小值并放在 i 位置，然后 i+1~n-1 范围上继续
public static void selectSort(int[] arr) {
  if (arr == null || arr.length < 2) return;
  int minIndex = 0;
  for (int i = 0; i < arr.length; i++) {
    minIndex = i;
    for (int j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    swap(arr, minIndex, i);
  }
}

@Test
public void testSelectSort() {
  print(arr);
  selectSort(arr);
  print(arr);
}
```

```java [冒泡排序]
// 0~i 范围上，相邻位置较大的数滚下去，最大值最终来到 i 位置，然后 0~i-1 范围上继续
public static void bubbleSort(int[] arr) {
  if (arr == null || arr.length < 2) return;
  for (int i = arr.length - 1; i > 0; i--) {
    for (int j = 0; j < i; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
      }
    }
  }
}

@Test
public void testBubbleSort() {
  print(arr);
  bubbleSort(arr);
  print(arr);
}
```

```java [插入排序]
// 0~i 范围上已经有序，新来的数从右到左滑到不再小的位置插入，然后继续
public static void insertSort(int[] arr) {
  if (arr == null || arr.length < 2) return;
  for (int i = 1; i < arr.length; i++) {
    for (int j = i - 1; j >= 0 && arr[j] > arr[j + 1]; j--) {
      swap(arr, j, j + 1);
    }
  }
}

@Test
public void testInsertSort() {
  print(arr);
  insertSort(arr);
  print(arr);
}
```

:::




# 对数器

## 对数器的试用场景

你在网上找到了某个公司的面试题，你想了好久，感觉自己会做，但是你找不到在线测试，你好心烦..

你和朋友交流面试题，你想了好久，感觉自己会做，但是你找不到在线测试，你好心烦..

你在网上做笔试，但是前几个测试用例都过了，突然一个巨大无比数据量来了，结果你的代码报错了，如此大的数据量根本看不出哪错了，甚至有的根本不提示哪个例子错了，怎么 debug？你好心烦…

## 对数器的实现

1. 你想要测的方法 a（最优解）
2. 实现复杂度不好但是容易实现的方法 b（暴力解）
3. 实现一个随机样本产生器（长度也随机、值也随机）
4. 把方法 a 和方法 b 跑相同的输入样本，看看得到的结果是否一样
5. 如果有一个随机样本使得比对结果不一致，打印这个出错的样本进行人工干预，改对方法 a 和方法 b
6. 当样本数量很多时比对测试依然正确，可以确定方法 a（最优解）已经正确。 

关键是第 5 步，找到一个数据量小的错误样本，便于你去带入 debug，然后把错误例子带入代码一步一步排查，Print 大法、断点技术都可以。对数器的门槛其实是比较高的，因为往往需要在两种不同思路下实现功能相同的两个方法，暴力一个、想象中的最优解是另一个。以后的很多题目都会用到对数器，几乎可以验证任何方法，尤其在验证贪心、观察规律方面很有用。到时候会丰富很多对数器的实战用法，这里只是一个简单易懂的示例

```java
public class Validator {
    // 为了验证
    public static void main(String[] args) {
        // 随机数组最大长度
        int N = 200;
        // 随机数组每个值，在 1~V 之间等概率随机
        int V = 1000;
        // testTimes : 测试次数
        int testTimes = 50000;
        System.out.println("测试开始");
        for (int i = 0; i < testTimes; i++) {
            // 随机得到一个长度，长度在 [0~N-1]
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
                // 可能要把例子带入，每个方法，去 debug！
            }
        }
        System.out.println("测试结束");
    }

    // 为了验证
    // 得到一个随机数组，长度是 n
    // 数组中每个数，都在 1~v 之间，随机得到
    public static int[] randomArray(int n, int v) {
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            // Math.random() -> double -> [0,1)范围山的一个小数，0.37463473126、0.001231231，等概率！
            // Math.random() * v -> double -> [0, v)一个小数，依然等概率
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

    // 数组中交换 i 和 j 位置的数
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


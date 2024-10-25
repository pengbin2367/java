# 时间复杂度和空间复杂度

1. 常数操作，固定时间的操作，执行时间和数据量无关
2. 时间复杂度，一个和数据量有关、只要高阶项、不要低阶项、不要常数项的操作次数表达式
   举例：选择、冒泡、插入
3. 严格固定流程的算法，一定强调最差情况！比如插入排序
4. 算法流程上利用随机行为作为重要部分的，要看平均或者期望的时间复杂度，因为最差的时间复杂度无意义
   用生成相邻值不同的数组来说明
5. 算法流程上利用随机行为作为重要部分的，还有随机快速排序（【必备】课）、跳表（【扩展】课）
   也只在乎平均或者期望的时间复杂度，因为最差的时间复杂度无意义
6. 时间复杂度的内涵：描述算法运行时间和数据量大小的关系，而且当数据量很大很大时，这种关系相当的本质，并且排除了低阶项、常数时间的干扰
7. 空间复杂度，强调额外空间；常数项时间，放弃理论分析、选择用实验来确定，因为不同常数操作的时间不同
8. 什么叫最优解，先满足时间复杂度最优，然后尽量少用空间的解

9. 时间复杂度的均摊，用动态数组的扩容来说明（等比数列、均摊的意义）
   并查集、单调队列、单调栈、哈希表等结构，均有这个概念。这些内容【必备】课都会讲
10. 不要用代码结构来判断时间复杂度，比如只有一个while循环的冒泡排序，其实时间复杂度O(N^2)
11. 不要用代码结构来判断时间复杂度，比如：N/1 + N/2 + N/3 + … + N/N，这个流程的时间复杂度是O(N * logN)，著名的调和级数
12. 时间复杂度只能是对算法流程充分理解才能分析出来，而不是简单的看代码结构！这是一个常见的错误！
    甚至有些算法的实现用了多层循环嵌套，但时间复杂度是O(N)的。在【必备】课程里会经常见到
13. 常见复杂度一览：
    O(1) O(logN) O(N) O(N*logN) O(N^2) … O(N^k) O(2^N) … O(k^N) … O(N!)
14. 时间复杂度非常重要，可以直接判断某个方法能不能通过一个题目，根据数据量猜解法，【必备】课都会讲
15. 整套课会讲很多算法和数据结构，也会见到很多的时间复杂度的表达，持续看课即可

等差数列求和公式 S = n / 2 * ( 2 * a1 + (n - 1) * d)  其中，S 是等差数列的和；n 是项数；a1 是首项；d 是公差。也可以认为任何等差数列的都符合：a * n平方 + b * n + c，其中a、b、c都是常数

```java
public class Complexity {

	// 只用一个循环完成冒泡排序
	// 但这是时间复杂度O(N^2)的！
	public static void bubbleSort(int[] arr) {
		if (arr == null || arr.length < 2) {
			return;
		}
		int n = arr.length;
		int end = n - 1, i = 0;
		while (end > 0) {
			if (arr[i] > arr[i + 1]) {
				swap(arr, i, i + 1);
			}
			if (i < end - 1) {
				i++;
			} else {
				end--;
				i = 0;
			}
		}
	}

	public static void swap(int[] arr, int i, int j) {
		int tmp = arr[i];
		arr[i] = arr[j];
		arr[j] = tmp;
	}

	public static void main(String[] args) {
		// 随机生成长度为n
		// 值在0~v-1之间
		// 且任意相邻两数不相等的数组
		int n = 10;
		int v = 4;
		int[] arr1 = new int[n];
		arr1[0] = (int) (Math.random() * v);
		for (int i = 1; i < n; i++) {
			do {
				arr1[i] = (int) (Math.random() * v);
			} while (arr1[i] == arr1[i - 1]);
		}
		for (int num : arr1) {
			System.out.print(num + " ");
		}
		System.out.println();
		System.out.println("=========");

		// java中的动态数组是ArrayList
		// 各个语言中的动态数组的初始大小和实际扩容因子可能会变化，但是均摊都是O(1)
		// 课上用2作为扩容因子只是举例而已
		ArrayList<Integer> arr2 = new ArrayList<>();
		arr2.add(5); // 0
		arr2.add(4); // 1
		arr2.add(9); // 2
		arr2.set(1, 6); // arr[1]由4改成了6
		System.out.println(arr2.get(1));
		System.out.println("=========");

		int[] arr = { 64, 31, 78, 0, 5, 7, 103 };
		bubbleSort(arr);
		for (int num : arr) {
			System.out.print(num + " ");
		}
		System.out.println();
		System.out.println("=========");

		int N = 200000;
		long start;
		long end;
		System.out.println("测试开始");
		start = System.currentTimeMillis();
		for (int i = 1; i <= N; i++) {
			for (int j = i; j <= N; j += i) {
				// 这两个嵌套for循环的流程，时间复杂度为O(N * logN)
				// 1/1 + 1/2 + 1/3 + 1/4 + 1/5 + ... + 1/n，也叫"调和级数"，收敛于O(logN)
				// 所以如果一个流程的表达式 : n/1 + n/2 + n/3 + ... + n/n
				// 那么这个流程时间复杂度O(N * logN)
			}
		}
		end = System.currentTimeMillis();
		System.out.println("测试结束，运行时间 : " + (end - start) + " 毫秒");

		System.out.println("测试开始");
		start = System.currentTimeMillis();
		for (int i = 1; i <= N; i++) {
			for (int j = i; j <= N; j++) {
				// 这两个嵌套for循环的流程，时间复杂度为O(N^2)
				// 很明显等差数列
			}
		}
		end = System.currentTimeMillis();
		System.out.println("测试结束，运行时间 : " + (end - start) + " 毫秒");

	}

}
```


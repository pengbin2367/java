# 基数排序

基于比较的排序：只需要定义好两个对象之间怎么比较即可，对象的数据特征并不关心，很通用

不基于比较的排序：和比较无关的排序，对于对象的数据特征有要求，并不通用

计数排序，非常简单，但是数值范围比较大了就不行了

基数排序的实现细节，非常优雅的一个实现

关键点：前缀数量分区的技巧、数字提取某一位的技巧

```java
	public class RadixSort {

    private static final int BASE = 10;
    private static final int MAXN = 100001;
    private static final int[] arr = new int[MAXN];
    private static final int[] help = new int[MAXN];
    private static final int[] cnts = new int[BASE];
    private static int n;

    public static void main(String[] args) throws IOException {
        StreamTokenizer in = new StreamTokenizer(new BufferedReader(new InputStreamReader(System.in)));
        PrintWriter out = new PrintWriter(new OutputStreamWriter(System.out));
        in.nextToken();
        n = (int) in.nval;
        for (int i = 0; i < n; i++) {
            in.nextToken();
            arr[i] = (int) in.nval;
        }
        sort();
        for (int i = 0; i < n - 1; i++) {
            out.print(arr[i] + " ");
        }
        out.println(arr[n - 1]);
        out.flush();
        out.close();
    }

    private static void sort() {
        int min = arr[0];
        for (int i = 0; i < n; i++) {
            min = Math.min(min, arr[i]);
        }
        int max = arr[0];
        for (int i = 0; i < n; i++) {
            arr[i] -= min;
            max = Math.max(max, arr[i]);
        }
        radixSort(bits(max));
        for (int i = 0; i < n; i++) {
            arr[i] += min;
        }
    }

    // 返回 num 在 BASE 进制下有几位
    private static int bits(int num){
        int ans = 0;
        while (num > 0) {
            ans++;
            num /= BASE;
        }
        return ans;
    }

    private static void radixSort(int bits) {
        for (int offset = 1; bits > 0; offset *= BASE, bits--) {
            Arrays.fill(cnts, 0);
            for (int i = 0; i < n; i++) {
                cnts[(arr[i] / offset) % BASE]++;
            }
            for (int i = 1; i < BASE; i++) {
                cnts[i] = cnts[i] + cnts[i - 1];
            }
            for (int i = n - 1; i >= 0; i--) {
                help[--cnts[(arr[i] / offset) % BASE]] = arr[i];
            }
            for (int i = 0; i < n; i++) {
                arr[i] = help[i];
            }
        }
    }
}
```

时间复杂度O(n)，额外空间复杂度O(m)，需要辅助空间做类似桶的作用，来不停的装入、弹出数字

一般来讲，计数排序要求，样本是整数，且范围比较窄

一般来讲，基数排序要求，样本是10进制的非负整数

如果不是就需要转化，代码里做了转化，并且代码里可以设置任何进制来进行排序

一旦比较的对象不再是常规数字，那么改写代价的增加是显而易见的，所以不基于比较的排序并不通用
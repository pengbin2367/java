# 堆结构常见题

[合并k个已排序的链表](https://www.nowcoder.com/practice/65cfde9e5b9b4cf2b6bafa5f3ef33fa6)

```java
public ListNode mergeKLists (ArrayList<ListNode> lists) {
    PriorityQueue<ListNode> heap = new PriorityQueue<>((a, b) -> a.val - b.val);
    for (ListNode node : lists) {
        if (node != null) {
            heap.add(node);
        }
    }
    ListNode head = heap.poll();
    if (head == null) return head;
    ListNode pre = head;
    if (pre.next != null) heap.add(pre.next);
    while (!heap.isEmpty()) {
        ListNode cur = heap.poll();
        pre.next = cur;
        pre = cur;
        if (cur.next != null) heap.add(cur.next);
    }
    return head;
}
```

[线段重合](https://www.nowcoder.com/questionTerminal/1ae8d0b6bb4e4bcdbf64ec491f63fc37)

```java
import java.util.*;
import java.io.*;

// 注意类名必须为 Main, 不要有任何 package xxx 信息
public class Main {
   private static int MAXN = 10001;
    private static int[][] lines = new int[MAXN][2];
    private static int n;
    private static int size;
    private static int[] heap = new int[MAXN];

    public static void main(String[] args) throws IOException {
        StreamTokenizer in = new StreamTokenizer(new BufferedReader(new InputStreamReader(System.in)));
        PrintWriter out = new PrintWriter(new BufferedWriter(new OutputStreamWriter(System.out)));
        in.nextToken();
        n = (int) in.nval;
        lines = new int[n][2];
        for (int i = 0; i < n; i++) {
            in.nextToken();
            lines[i][0] = (int) in.nval;
            in.nextToken();
            lines[i][1] = (int) in.nval;
        }
        out.println(maxCover());
        out.flush();
        out.close();
    }

    private static int maxCover() {
        int ans = 0;
        size = 0;
        Arrays.sort(lines, 0, n, (a, b) -> a[0] - b[0]);
        for (int i = 0; i < n; i++) {
            while (size > 0 && heap[0] <= lines[i][0]) {
                pop();
            }
            add(lines[i][1]);
            ans = Math.max(ans, size);
        }
        return ans;
    }

    private static void add(int x) {
        heap[size] = x;
        int i = size++;
        while (heap[i] < heap[(i - 1) / 2]) {
            swap(heap, i, (i - 1) / 2);
            i = (i - 1) / 2;
        }
    }

    private static void pop() {
        swap(heap, 0, --size);
        int i = 0, l = 1;
        while (l < size) {
            int best = l + 1 < size && heap[l + 1] < heap[l] ? l + 1 : l;
            best = heap[best] < heap[i] ? best : i;
            if (best == i) break;
            swap(heap, best, i);
            i = best;
            l = i * 2 + 1;
        }
    }

    private static void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}
```

​	

[2208. 将数组和减半的最少操作次数](https://leetcode.cn/problems/minimum-operations-to-halve-array-sum/)

```java
class Solution {
    public int halveArray(int[] nums) {
        int ans = 0;
        PriorityQueue<Double> heap = new PriorityQueue<>(Collections.reverseOrder());
        double sum = 0.0;
        for (int num : nums) {
            heap.add((double) num);
            sum += num;
        }
        double cur = 0.0;
        while (cur < sum / 2) {
            double tmp = heap.poll() / 2;
            cur += tmp;
            heap.add(tmp);
            ans++;
        }
        return ans;
    }
}
```


# 随机选择算法

[215. 数组中的第K个最大元素](https://leetcode.cn/problems/kth-largest-element-in-an-array/)

```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        return randomizedSelect(nums, nums.length - k);
    }

    private int first, last;

    private int randomizedSelect(int[] nums, int k) {
        int left = 0, right = nums.length - 1, res = 0;
        while (left <= right) {
            partition(nums, left, right, nums[left + (int)(Math.random() * (right - left + 1))]);
            if (k < first) {
                right = first - 1;
            } else if (k > last) {
                left = last + 1;
            } else {
                res = nums[k];
                break;
            }
        }
        return res;
    }

    private void partition(int[] nums, int left, int right, int x) {
        first = left;
        last = right;
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
}
```

利用改写快排的方法，时间复杂度O(n)，额外空间复杂度O(1)

上面问题的解法就是随机选择算法，是常考内容！本视频定性讲述，定量证明略，算法导论-9.2有详细证明

> 不要慌！
>
> 随机快速排序、随机选择算法，时间复杂度的证明理解起来很困难，只需记住结论，但并不会对后续的算法学习造成什么影响
>
> 因为数学很好才能理解的算法和数据结构其实比较少，绝大部分的内容都只需要高中数学的基础就能理解
>
> 算法导论第9章，还有一个BFPRT算法，不用随机选择一个数的方式，也能做到时间复杂度O(n)，额外空间复杂度O(log n)
>
> 早些年我还讲这个算法，不过真的很冷门，很少在笔试、面试、比赛场合出现，所以算了。有兴趣的同学可以研究一下	

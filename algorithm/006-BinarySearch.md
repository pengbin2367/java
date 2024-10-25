# 二分搜索

通常来说，二分搜索是建立在待查找集合中的元素是有序的，可以分为以下三类问题：

## 在有序数组中确定 num 存在还是不存在

```java
/**
     * 判断 nums 中是否存在元素 target
     * @param nums 升序数组
     * @param target 目标元素
     * @return 存在返回true,反之false
     */
public static boolean exist(int[] nums, int target) {
  if (nums == null || nums.length == 0) return false;
  int left = 0, right = nums.length - 1, mid = 0;
  while (left <= right) {
    mid = left + ((right - left) >> 1);
    if (nums[mid] == target) {
      return true;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return false;
}
```

## 在有序数组中找 >= num 的最左位置

```java
/**
     * 给出 nums 中大于等于 target 的最左元素位置
     * @param nums 升序数组
     * @param target 目标元素
     * @return 存在这个元素返回位置，不存在则返回-1
     */
private int findLeft(int[] nums, int target) {
  int left = 0, right = nums.length - 1, mid = 0, res = -1;
  while (left <= right) {
    mid = left + ((right - left) >> 1);
    if (nums[mid] >= target) {
      res = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return res;
}
```

## 在有序数组中找 <= num 的最右位置

```java
/**
     * 给出 nums 中小于等于 target 的最右元素位置
     * @param nums 升序数组
     * @param target 目标元素
     * @return 存在这个元素返回位置，不存在则返回-1
     */
private int findRight(int[] nums, int target) {
  int left = 0, right = nums.length - 1, mid = 0, res = -1;
  while (left <= right) {
    mid = left + ((right - left) >> 1);
    if (nums[mid] <= target) {
      res = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return res;
}
```

:::info

二分搜索不一定发生在有序数组上（比如寻找峰值问题）。“二分答案法”这个非常重要的算法，很秀很厉害，将在【必备】课程里继续

如果数组长度为 n，那么二分搜索搜索次数是 log n 次，以 2 为底【下节课讲时间复杂度，二分搜索时间复杂度 O(log n)】

:::

## 无序数组上的二分搜索

峰值元素是指其值严格大于左右相邻值的元素，给你一个整数数组 nums，已知任何两个相邻的值都不相等，找到峰值元素并返回其索引，数组可能包含多个峰值，在这种情况下，返回 任何一个峰值 所在位置即可。你可以假设 nums [-1] = nums [n] = 无穷小，你必须实现时间复杂度为 O(log n) 的算法来解决此问题。测试链接 : [162. 寻找峰值](https://leetcode.cn/problems/find-peak-element/)

## 扩展

[14. 最长公共前缀](https://leetcode.cn/problems/longest-common-prefix/)
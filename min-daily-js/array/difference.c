#include <iostream>
 
//函数声明 。两个辅助函数，用于判断子集。
void quickSort(int* arr, int si, int ei);
//如果arr2是arr1的子集，则返回1
bool isSubset(int arr1[], int arr2[], int m, int n) {
    int i = 0, j = 0;
 
    if (m < n)
        return 0;
 
    quickSort(arr1, 0, m - 1);
    quickSort(arr2, 0, n - 1);

    while (i < n && j < m) {
        if (arr1[j] < arr2[i])
            j++;
        else if (arr1[j] == arr2[i]) {
            j++;
            i++;
        }
        else if (arr1[j] > arr2[i])
            return 0;
    }
 
    if (i < n)
        return 0;
    else
        return 1;
}
 
//---------辅助函数begin--------
template<typename type>
void exchange(type* a, type* b) {
    type temp;
    temp = *a;
    *a = *b;
    *b = temp;
}
 
int partition(int A[], int si, int ei) {
    int x = A[ei];
    int i = (si - 1);
    int j;
 
    for (j = si; j <= ei - 1; j++) {
        if (A[j] <= x) {
            i++;
            exchange(&A[i], &A[j]);
        }
    }
    exchange(&A[i + 1], &A[ei]);
    return (i + 1);
}
 
/*
实现快速排序的函数
A[]：需要排序的数组
si：Starting index
ei：Ending index
*/
void quickSort(int A[], int si, int ei) {
    int pi;    //Partitioning index
    if (si < ei) {
        pi = partition(A, si, ei);
        quickSort(A, si, pi - 1);
        quickSort(A, pi + 1, ei);
    }
}
//---------辅助函数end--------
 
int main() {
    int arr1[] = { 11, 1, 13, 21, 3, 7 };
    int arr2[] = { 11, 3, 7, 1 };
 
    int numArr1 = sizeof(arr1) / sizeof(arr1[0]);
    int numArr2 = sizeof(arr2) / sizeof(arr2[0]);
 
    if (isSubset(arr1, arr2, numArr1, numArr2))
        std::cout << "arr2[] is subset of arr1[]";
    else
        std::cout << "arr2[] is not a subset of arr1[]";
 
    return 0;
}
#include <stdio.h>

int numPts;
int value;
int j;

void printBar(int n) {
  int k;
  for (k = 1; k <= n; k++) {
    printf("*");
  }
  printf("\n");
}

int main() {
  scanf("%d", &numPts);
  for (j = 1; j <= numPts; j++) {
    scanf("%d", &value);
    printBar(value);
  } // ra1
  return 0;
}


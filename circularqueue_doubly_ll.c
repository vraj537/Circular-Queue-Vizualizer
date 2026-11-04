#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *prev, *next;
} Node;

Node *front = NULL, *rear = NULL;

void enqueue(int val) {
    Node* nn = (Node*)malloc(sizeof(Node));
    nn->data = val;
    if (!front) {
        front = rear = nn;
        rear->next = front;
        front->prev = rear;
    } else {
        rear->next = nn;
        nn->prev = rear;
        rear = nn;
        rear->next = front;
        front->prev = rear;
    }
    printf("Enqueued: %d\n", val);
}

void dequeue() {
    if (!front) {
        printf("Queue Underflow\n");
        return;
    }
    printf("Dequeued: %d\n", front->data);
    if (front == rear) {
        free(front);
        front = rear = NULL;
    } else {
        Node* t = front;
        front = front->next;
        front->prev = rear;
        rear->next = front;
        free(t);
    }
}

void display() {
    if (!front) {
        printf("Queue is empty\n");
        return;
    }
    Node* temp = front;
    printf("Circular Doubly Linked List: ");
    do {
        printf("%d <-> ", temp->data);
        temp = temp->next;
    } while (temp != front);
    printf("(head: %d)\n", front->data);
}

int main() {
    enqueue(100);
    enqueue(200);
    enqueue(300);
    display();
    dequeue();
    display();
    return 0;
}

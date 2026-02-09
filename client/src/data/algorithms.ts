export interface Algorithm {
  id: string;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeComplexity: string;
  spaceComplexity: string;
  sampleInput: string;
  expectedOutput: string;
  explanation: string;
}

export interface DSATopic {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide-react icon name
  algorithms: Algorithm[];
}

export const dsaTopics: DSATopic[] = [
  {
    id: 'arrays',
    name: 'Arrays & Strings',
    description: 'Fundamental data structures and string manipulation techniques',
    icon: 'Grid3X3',
    algorithms: [
      {
        id: 'binary-search',
        name: 'Binary Search',
        description: 'Search algorithm that finds the position of a target value within a sorted array',
        difficulty: 'Easy',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)',
        sampleInput: 'Array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nTarget: 5',
        expectedOutput: 'Index: 4 (0-based indexing)',
        explanation: 'Binary search repeatedly divides the search interval in half until the target is found.'
      },
      {
        id: 'two-sum',
        name: 'Two Sum',
        description: 'Find two numbers in an array that add up to a specific target sum',
        difficulty: 'Easy',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        sampleInput: 'Array: [2, 7, 11, 15]\nTarget: 9',
        expectedOutput: 'Indices: [0, 1]',
        explanation: 'Use a hash map to store complements and find the pair that adds up to target.'
      },
      {
        id: 'reverse-string',
        name: 'Reverse String',
        description: 'Reverse the characters in a string in-place',
        difficulty: 'Easy',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        sampleInput: 'String: "hello"',
        expectedOutput: 'Reversed: "olleh"',
        explanation: 'Use two pointers from both ends and swap characters moving towards center.'
      }
    ]
  },
  {
    id: 'linkedlist',
    name: 'Linked Lists',
    description: 'Dynamic data structures with node-based memory allocation',
    icon: 'Link',
    algorithms: [
      {
        id: 'reverse-linkedlist',
        name: 'Reverse Linked List',
        description: 'Reverse the direction of links in a singly linked list',
        difficulty: 'Easy',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        sampleInput: 'List: 1 -> 2 -> 3 -> 4 -> 5',
        expectedOutput: 'Reversed: 5 -> 4 -> 3 -> 2 -> 1',
        explanation: 'Iteratively reverse the next pointers of each node.'
      },
      {
        id: 'merge-sorted-lists',
        name: 'Merge Two Sorted Lists',
        description: 'Combine two sorted linked lists into one sorted list',
        difficulty: 'Easy',
        timeComplexity: 'O(n + m)',
        spaceComplexity: 'O(1)',
        sampleInput: 'List1: 1 -> 2 -> 4\nList2: 1 -> 3 -> 4',
        expectedOutput: 'Merged: 1 -> 1 -> 2 -> 3 -> 4 -> 4',
        explanation: 'Compare nodes from both lists and link the smaller one to result.'
      }
    ]
  },
  {
    id: 'trees',
    name: 'Trees & Graphs',
    description: 'Hierarchical and graph-based data structures',
    icon: 'GitBranch',
    algorithms: [
      {
        id: 'binary-tree-inorder',
        name: 'Binary Tree Inorder Traversal',
        description: 'Traverse a binary tree in inorder sequence (left, root, right)',
        difficulty: 'Easy',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(h)',
        sampleInput: 'Tree:\n    1\n     \\\n      2\n     /\n    3',
        expectedOutput: 'Inorder: [1, 3, 2]',
        explanation: 'Visit left subtree, then root, then right subtree recursively.'
      },
      {
        id: 'max-depth',
        name: 'Maximum Depth of Binary Tree',
        description: 'Find the maximum depth (height) of a binary tree',
        difficulty: 'Easy',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(h)',
        sampleInput: 'Tree:\n    3\n   / \\\n  9  20\n    /  \\\n   15   7',
        expectedOutput: 'Max Depth: 3',
        explanation: 'Recursively find the maximum depth of left and right subtrees.'
      }
    ]
  },
  {
    id: 'sorting',
    name: 'Sorting Algorithms',
    description: 'Algorithms for arranging data in a particular order',
    icon: 'ArrowUpDown',
    algorithms: [
      {
        id: 'bubble-sort',
        name: 'Bubble Sort',
        description: 'Simple sorting algorithm that repeatedly swaps adjacent elements',
        difficulty: 'Easy',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        sampleInput: 'Array: [64, 34, 25, 12, 22, 11, 90]',
        expectedOutput: 'Sorted: [11, 12, 22, 25, 34, 64, 90]',
        explanation: 'Compare adjacent elements and swap if they are in wrong order.'
      },
      {
        id: 'merge-sort',
        name: 'Merge Sort',
        description: 'Efficient divide-and-conquer sorting algorithm',
        difficulty: 'Medium',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        sampleInput: 'Array: [64, 34, 25, 12, 22, 11, 90]',
        expectedOutput: 'Sorted: [11, 12, 22, 25, 34, 64, 90]',
        explanation: 'Divide array into halves, sort them separately, then merge.'
      }
    ]
  },
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    description: 'Optimization technique using overlapping subproblems',
    icon: 'Zap',
    algorithms: [
      {
        id: 'fibonacci',
        name: 'Fibonacci Number',
        description: 'Calculate the nth number in the Fibonacci sequence',
        difficulty: 'Easy',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        sampleInput: 'n = 10',
        expectedOutput: 'Fibonacci(10) = 55',
        explanation: 'Use dynamic programming to avoid recalculating same subproblems.'
      },
      {
        id: 'climbing-stairs',
        name: 'Climbing Stairs',
        description: 'Find number of distinct ways to climb n stairs',
        difficulty: 'Easy',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        sampleInput: 'n = 5 (can climb 1 or 2 steps at a time)',
        expectedOutput: 'Ways to climb: 8',
        explanation: 'Each step can be reached from 1 or 2 steps before it.'
      }
    ]
  }
];

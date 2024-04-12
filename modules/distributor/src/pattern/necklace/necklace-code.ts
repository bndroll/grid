export const generateNecklaceCode = (kandidat: number[], batch: number, grid: string[]) => `
({
  exec: function () {
    let b = [];
    let c0 = [${kandidat.join(',')}];
    let g = [${grid.join(',')}];

    for (let i = 0; i < batch; i++) {
        b.push([...c0]); // Push initial array to output
        for (let j = c0.length - 1; j >= 0; j--) {
            if (c0[j] < 7) {
                c0[j]++; // Increment current element if less than 7
                break; // Break the loop after incrementing
            } else {
                c0[j] = 1; // Reset to 1 when reaching 7
                if (j > 0) {
                    continue; // Continue the loop to ensure correct incrementation of the third-to-last element
                } else {
                    break; // Break the loop if it's the first element
                }
            }
        }
    }

    function validateSolution(solution, grid) {
      const size = grid.length;
      const length = Math.sqrt(size);

      for (let i = 0; i < solution.length; i++) {
        if (solution[i] === 1) {
          if (![2, 4, 6].includes(solution[i - 1])) {
            return false;
          }
          if (![3, 4, 5].includes(solution[i + length])) {
            return false;
          }
        } else if (solution[i] === 2) {
          if (![1, 3, 6].includes(solution[i + 1])) {
            return false;
          }
          if (![3, 4, 5].includes(solution[i + length])) {
            return false;
          }
        } else if (solution[i] === 3) {
          if (![2, 4, 6].includes(solution[i - 1])) {
            return false;
          }
          if (![1, 2, 5].includes(solution[i - length])) {
            return false;
          }
        } else if (solution[i] === 4) {
          if (![1, 3, 6].includes(solution[i + 1])) {
            return false;
          }
          if (![1, 2, 5].includes(solution[i - length])) {
            return false;
          }
        } else if (solution[i] === 5) {
          if (![3, 4].includes(solution[i + length])) {
            return false;
          }
          if (![1, 2].includes(solution[i - length])) {
            return false;
          }
        } else if (solution[i] === 6) {
          if (![1, 3].includes(solution[i + 1])) {
            return false;
          }
          if (![2, 4].includes(solution[i - 1])) {
            return false;
          }
        }

        if (i < length) {
          if ([3, 4, 5].includes(solution[i])) {
            return false;
          }
        }
        if (i >= size - length) {
          if ([1, 2, 5].includes(solution[i])) {
            return false;
          }
        }
        if (i % length === 0) {
          if ([1, 3, 6].includes(solution[i])) {
            return false;
          }
        }
        if (i % length === length - 1) {
          if ([2, 4, 6].includes(solution[i])) {
            return false;
          }
        }

        if (grid[i] === 'a') {
          if (![1, 2, 3, 4].includes(solution[i])) {
            return false;
          }
        }
        else if (grid[i] === 'b') {
          if (![5, 6].includes(solution[i])) {
            return false;
          }
        }
        else if (grid[i] === 'c') {
          if (![7].includes(solution[i])) {
            return false;
          }
        }
        
        
      }
      return true;
    }

    let solutions = [];
    for (const el of b) {
      if (validateSolution(el, g)) {
        solutions.push(el.slice());
      }
    }
    return solutions.length === 0 ? null : solutions;
  },
});
`;

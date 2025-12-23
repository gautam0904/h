import jsonfile from 'jsonfile';
import moment from 'moment';
import random from 'random';
import simpleGit from 'simple-git';
import seedrandom from 'seedrandom';


const rng = seedrandom('github-graph-seed');

const path = './data.json';
const VERBS = [
    'Refactor', 'Optimize', 'Fix', 'Improve', 'Update',
    'Add', 'Remove', 'Handle', 'Implement', 'Adjust',
    'Cleanup', 'Enhance', 'Validate', 'Restructure'
  ];
  
  const OBJECTS = [
    'API', 'auth flow', 'database query', 'UI state',
    'error handling', 'cache logic', 'build config',
    'validation logic', 'middleware', 'scheduler',
    'deployment script', 'service layer'
  ];
  
  const DETAILS = [
    'for edge cases',
    'for performance',
    'for better readability',
    'to prevent crash',
    'to fix race condition',
    'to reduce latency',
    'to improve stability',
    'to handle null values',
    'based on feedback',
    'for production'
  ];
  

const randomMessage = () => {
    const v = VERBS[Math.floor(rng() * VERBS.length)];
    const o = OBJECTS[Math.floor(rng() * OBJECTS.length)];
    const d = DETAILS[Math.floor(rng() * DETAILS.length)];
  
    // Variations (human-like)
    const patterns = [
      `${v} ${o}`,
      `${v} ${o} ${d}`,
      `${v.toLowerCase()} ${o} ${d}`,
      `${v} ${o} (${d})`
    ];
  
    return patterns[Math.floor(rng() * patterns.length)];
  };
  

const makeCommits = (n) => {
    if (n === 0) return;

    const x = random.int(0, 52);
    const y = random.int(0, 6);

    const date = moment()
        .subtract(1, 'year')
        .add(x, 'week')
        .add(y, 'day')
        .format();

    const data = { date };

    jsonfile.writeFile(path, data, async () => {
        const git = simpleGit({
            env: {
                ...process.env,
                GIT_AUTHOR_DATE: date,
                GIT_COMMITTER_DATE: date,
            },
        });
        await git.add([path]);
        await git.commit(randomMessage(), { '--date': date }, () => {
            makeCommits(n - 1);
            console.log(`Marked commit on week ${x}, day ${y}`);
        })
    });


};

makeCommits(499);


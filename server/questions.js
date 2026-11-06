import { randomInt } from "node:crypto";

const vocabulary = {
  Easy: [
    ["SUN", "nature", "A bright star that gives Earth light during the day."],
    ["CLOCK", "object", "A device used to show the time."],
    ["CAT", "animal", "A small domesticated animal that often says meow."],
    ["SCHOOL", "place", "A place where students go to learn."],
    ["BOOK", "object", "A set of written or printed pages bound together."],
    ["BRIDGE", "structure", "A structure built to cross over a river or road."],
    ["DOG", "animal", "A domesticated animal that often barks."],
    ["GARDEN", "place", "A place where flowers or vegetables are grown."],
    ["MOON", "space object", "The natural object that orbits Earth at night."],
    ["SNOW", "weather", "Soft white ice crystals that fall from clouds."],
    ["BANANA", "fruit", "A long, curved yellow fruit."],
    ["SPRING", "season", "The season when many plants begin to bloom."],
    ["BICYCLE", "vehicle", "A two-wheeled vehicle powered by pedals."],
    ["HEART", "body part", "The organ that pumps blood around the body."],
    ["OCEAN", "nature", "A very large body of salt water."],
    ["LIGHTNING", "weather", "A bright flash of electricity during a storm."],
    ["AIRPLANE", "vehicle", "A powered vehicle that flies through the air."],
    ["BREAKFAST", "meal", "The first meal of the day."],
    ["AWAKE", "state", "Not sleeping."],
    ["BOTTLE", "object", "A container, often made of glass or plastic, for liquids."],
    ["RIVER", "nature", "A large natural stream of flowing water."],
    ["MOUNTAIN", "nature", "A very high area of land with steep sides."],
    ["WINDOW", "object", "An opening in a wall, usually fitted with glass."],
    ["PENCIL", "object", "A tool for writing or drawing that can be sharpened."],
    ["CHAIR", "furniture", "A piece of furniture made for one person to sit on."],
    ["WATER", "drink", "A clear liquid that people need to live."],
    ["RAINBOW", "weather", "A colorful arc that can appear in the sky after rain."],
    ["MONKEY", "animal", "A clever animal that climbs trees and has a long tail."],
    ["TURTLE", "animal", "A slow-moving reptile protected by a hard shell."],
    ["ELEPHANT", "animal", "A very large animal with a trunk and big ears."],
    ["FLOWER", "plant", "The colorful part of a plant that can produce seeds."],
    ["KITCHEN", "place", "A room where food is prepared and cooked."],
    ["TEACHER", "profession", "A person whose job is to help students learn."],
    ["FRIEND", "person", "A person you know well and enjoy spending time with."],
    ["FAMILY", "group", "A group of people related to one another."],
    ["ORANGE", "fruit", "A round citrus fruit with a bright-colored peel."],
    ["PURPLE", "color", "A color made by combining red and blue."],
    ["CIRCLE", "shape", "A round shape with no corners."],
    ["PLANET", "space object", "A large round object that travels around a star."],
    ["ROCKET", "vehicle", "A vehicle that uses powerful engines to travel into space."],
    ["FARMER", "profession", "A person whose job is to grow crops or raise animals."],
    ["DOCTOR", "profession", "A person trained to care for sick or injured people."],
    ["LIBRARY", "place", "A place where people can borrow books."],
    ["PICTURE", "art", "An image made by drawing, painting, or taking a photo."],
    ["MUSIC", "art", "Sounds arranged to create a pleasing pattern."],
    ["POCKET", "object", "A small sewn pouch in clothing for carrying things."],
    ["UMBRELLA", "object", "A portable cover that helps keep rain off."],
    ["HOLIDAY", "event", "A special day when many people do not work or go to school."],
    ["WHISPER", "action", "To speak very softly so that only nearby people can hear."],
    ["SUNSHINE", "weather", "The light and warmth that come from the sun."],
    ["CARROT", "vegetable", "A crunchy orange root vegetable."],
    ["PILLOW", "furniture", "A soft cushion used to support your head in bed."]
  ],
  Medium: [
    ["PASSION", "feeling", "A strong feeling of enthusiasm or excitement."],
    ["ASTRONOMER", "profession", "A scientist who studies stars, planets, and space."],
    ["RESILIENCE", "quality", "The ability to recover after difficulty."],
    ["SUMMARY", "writing", "A short statement of the main points."],
    ["JOURNEY", "event", "A trip from one place to another."],
    ["THERMOMETER", "instrument", "An instrument used to measure temperature."],
    ["CURIOSITY", "feeling", "A strong desire to know or learn something."],
    ["ESSENTIAL", "quality", "Absolutely necessary or extremely important."],
    ["IMPROVE", "action", "To make something better."],
    ["ANALYSIS", "study", "A detailed examination of something."],
    ["MUSEUM", "place", "A building where objects of historical or artistic interest are displayed."],
    ["GEOLOGIST", "profession", "A scientist who studies rocks and the structure of Earth."],
    ["DEMOCRACY", "government", "A system of government in which people have a say in decisions."],
    ["TOURIST", "person", "A person who travels to visit places for pleasure."],
    ["FRUSTRATION", "feeling", "Annoyance caused by being unable to do or achieve something."],
    ["RELIABLE", "quality", "Able to be trusted or depended on."],
    ["CARTOGRAPHER", "profession", "A person whose work is making maps."],
    ["CONSERVATION", "action", "The protection of nature, wildlife, or resources."],
    ["GENEROUS", "quality", "Willing to give or share more than is expected."],
    ["ANCIENT", "time", "Belonging to the very distant past."],
    ["COMPOSER", "profession", "A person who writes music."],
    ["VOYAGE", "event", "A long journey, especially by sea or through space."],
    ["GRADUAL", "quality", "Happening slowly over a period of time."],
    ["SILENT", "state", "Making no sound."],
    ["PEACEFUL", "quality", "Calm and free from disturbance."],
    ["HISTORIC", "quality", "Important or famous in history."],
    ["CHARITABLE", "quality", "Willing to give help or money to people in need."],
    ["NOVEL", "writing", "A long work of fictional prose."],
    ["POETRY", "writing", "Writing that uses rhythm and carefully chosen language."],
    ["ESSAY", "writing", "A short piece of writing about a particular subject."],
    ["OBSERVATORY", "place", "A building equipped for studying stars and space."],
    ["COMPASS", "instrument", "A device that shows direction."],
    ["PHOTOGRAPHY", "art", "The art or practice of taking pictures with a camera."],
    ["INGREDIENT", "food", "One of the foods or materials used to make a dish."],
    ["INDEPENDENT", "quality", "Able to act or think without relying on others."],
    ["PATIENT", "quality", "Able to wait calmly without becoming annoyed."],
    ["TRADITION", "custom", "A custom or belief passed down over time."],
    ["EVIDENCE", "proof", "Information or objects that help show whether something is true."],
    ["PREDICTION", "idea", "A statement about what may happen in the future."],
    ["DISCOVER", "action", "To find something that was not known before."],
    ["CELEBRATE", "action", "To do something enjoyable for a special occasion."],
    ["ACCURATE", "quality", "Correct and free from mistakes."],
    ["FERTILE", "quality", "Able to produce many plants or crops."],
    ["SCULPTURE", "art", "A three-dimensional work of art made by shaping material."],
    ["CONVENIENT", "quality", "Easy to use or suitable for a particular purpose."],
    ["RESPONSIBLE", "quality", "Reliable and willing to accept the results of your actions."],
    ["FREQUENT", "time", "Happening often."],
    ["MYSTERY", "idea", "Something that is difficult to explain or understand."],
    ["COURAGEOUS", "quality", "Showing bravery when facing danger or difficulty."],
    ["INFLUENCE", "action", "The power to affect how someone thinks or acts."],
    ["VOLUNTEER", "person", "A person who offers to do work without being paid."]
  ],
  Hard: [
    ["EMPATHY", "feeling", "The ability to understand and share another person's feelings."],
    ["BEWILDERMENT", "feeling", "A state of confusion or perplexity."],
    ["PERSEVERANCE", "quality", "Continued effort despite difficulty or delay."],
    ["CONCISE", "quality", "Brief but clear in expressing an idea."],
    ["ARCHITECT", "profession", "A person who designs buildings."],
    ["UBIQUITOUS", "quality", "Present or found everywhere."],
    ["UNOBTRUSIVE", "quality", "Not attracting attention; inconspicuous."],
    ["PITHY", "quality", "Using few words to express an idea effectively."],
    ["METICULOUS", "quality", "Extremely careful about details."],
    ["PALINDROME", "word", "A word or phrase that reads the same backward and forward."],
    ["ETYMOLOGY", "study", "The study of the origin and history of words."],
    ["OLIGARCHY", "government", "A government controlled by a small group of powerful people."],
    ["APHORISM", "writing", "A short statement that expresses a general truth."],
    ["RECLUSE", "person", "A person who lives away from other people."],
    ["EPHEMERAL", "time", "Lasting for only a very short time."],
    ["PANACEA", "medicine", "A supposed remedy for every problem or disease."],
    ["UNDERSTATE", "action", "To describe something as less important than it really is."],
    ["AMBIDEXTROUS", "quality", "Equally skilled at using both hands."],
    ["BREVITY", "quality", "The quality of using few words."],
    ["PERSPICACIOUS", "quality", "Quick to notice and understand things."],
    ["BENEVOLENT", "quality", "Kind and generous."],
    ["MALIGNANT", "quality", "Harmful or likely to cause damage."],
    ["CANDID", "quality", "Honest and direct in speech."],
    ["DECEITFUL", "quality", "Likely to make someone believe something untrue."],
    ["ALTRUISTIC", "quality", "Showing unselfish concern for other people."],
    ["INGENIOUS", "quality", "Clever, original, and inventive."],
    ["PRAGMATIC", "quality", "Dealing with problems in a practical way."],
    ["SCRUTINIZE", "action", "To examine something very carefully."],
    ["AMBIGUOUS", "quality", "Having more than one possible meaning."],
    ["ELOQUENT", "quality", "Fluent and persuasive in speaking or writing."],
    ["ARTICULATE", "quality", "Able to express ideas clearly."],
    ["FLUENT", "quality", "Able to speak or write smoothly and easily."],
    ["AUSTERE", "quality", "Plain and without decoration or comfort."],
    ["MAGNANIMOUS", "quality", "Generous and forgiving, especially toward a rival."],
    ["INTRANSIGENT", "quality", "Unwilling to change one's views or agree."],
    ["LACONIC", "quality", "Using very few words."],
    ["OBSTINATE", "quality", "Stubbornly refusing to change one's opinion."],
    ["TENACIOUS", "quality", "Persistent and unwilling to give up."],
    ["VENERABLE", "quality", "Respected because of age, wisdom, or character."],
    ["RESILIENT", "quality", "Able to recover quickly from difficulties."],
    ["QUINTESSENCE", "idea", "The most perfect example of a quality or type."],
    ["SURREPTITIOUS", "quality", "Kept secret because it would not be approved of."],
    ["PERNICIOUS", "quality", "Having a harmful effect, often gradually."],
    ["INEFFABLE", "quality", "Too great or extreme to be described in words."],
    ["EQUANIMITY", "quality", "Calmness and self-control, especially in difficulty."],
    ["FASTIDIOUS", "quality", "Very attentive to accuracy and detail."],
    ["OBSCURE", "quality", "Not well known or difficult to understand."],
    ["PROLIFIC", "quality", "Producing many works, results, or offspring."],
    ["CONUNDRUM", "idea", "A confusing and difficult problem or question."],
    ["INEVITABLE", "time", "Certain to happen and impossible to avoid."],
    ["MUNIFICENT", "quality", "More generous than is usual or necessary."]
  ]
};

const roundTypes = ["Word Scramble", "Guess the Word", "Missing Letters", "Speed Spelling", "Odd Word Out"];
const questionHistory = new Map();
const questionPools = new Map();
const roundsPerMatch = 10;
const matchesToRemember = 20;

function shuffle(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function scramble(word) {
  const letters = word.split("");
  for (let attempt = 0; attempt < 10; attempt++) {
    const result = shuffle(letters).join("");
    if (result !== word) return result;
  }
  return `${word.slice(1)}${word[0]}`;
}

function makeWordQuestion(type, word, clue) {
  const id = `${type}:${word}`;
  const question = { id, type, prompt: "", clue, answer: word, display: "" };

  if (type === "Word Scramble") {
    question.prompt = "Rearrange these letters to make a word.";
    question.display = scramble(word);
  } else if (type === "Guess the Word") {
    question.prompt = "Read the clue and guess the word.";
    question.display = `Word length: ${word.length} letters`;
  } else if (type === "Missing Letters") {
    question.prompt = "Fill in the missing letters.";
    const letters = word.split("");
    const hiddenCount = Math.max(1, Math.floor(letters.length / 3));
    const positions = shuffle(Array.from({ length: Math.max(0, letters.length - 2) }, (_, index) => index + 1));
    for (const position of positions.slice(0, hiddenCount)) letters[position] = "_";
    question.display = letters.join(" ");
  } else {
    question.prompt = "Spell the word described by the clue.";
    question.display = `Word length: ${word.length} letters`;
  }

  return question;
}

function makeOddWordQuestions(entries) {
  const groups = new Map();
  for (const entry of entries) {
    if (!groups.has(entry.category)) groups.set(entry.category, []);
    groups.get(entry.category).push(entry.word);
  }

  const questions = [];
  for (const [category, members] of groups) {
    if (members.length < 3) continue;
    for (let a = 0; a < members.length - 2; a++) {
      for (let b = a + 1; b < members.length - 1; b++) {
        for (let c = b + 1; c < members.length; c++) {
          for (const outsider of entries) {
            if (outsider.category === category) continue;
            const choices = shuffle([members[a], members[b], members[c], outsider.word]);
            const id = `Odd Word Out:${category}:${[...choices].sort().join(":")}`;
            questions.push({
              id,
              type: "Odd Word Out",
              prompt: "Choose the word that does not belong.",
              clue: `Which word is not a ${category}?`,
              answer: outsider.word,
              display: choices.join(" · "),
              choices
            });
          }
        }
      }
    }
  }

  return questions;
}

function buildQuestionPools(level) {
  const entries = vocabulary[level].map(([word, category, clue]) => ({ word, category, clue }));
  const pools = new Map(roundTypes.slice(0, 4).map(type => [
    type,
    entries.map(({ word, clue }) => makeWordQuestion(type, word, clue))
  ]));
  pools.set("Odd Word Out", makeOddWordQuestions(entries));
  return pools;
}

function getTwoUnusedQuestions(pool, recentIds, type) {
  const available = [...new Map(
    pool.filter(question => !recentIds.has(question.id)).map(question => [question.id, question])
  ).values()];
  if (available.length < 2) {
    throw new Error(`Not enough unused ${type} questions to maintain the ${matchesToRemember}-match repeat limit.`);
  }
  return shuffle(available).slice(0, 2);
}

export function getQuestionSet(level) {
  const selectedLevel = vocabulary[level] ? level : "Easy";
  let pools = questionPools.get(selectedLevel);
  if (!pools) {
    pools = buildQuestionPools(selectedLevel);
    questionPools.set(selectedLevel, pools);
  }

  const recentMatches = questionHistory.get(selectedLevel) || [];
  const recentIds = new Set(recentMatches.flat());
  const set = roundTypes.flatMap(type => getTwoUnusedQuestions(pools.get(type), recentIds, type));
  const questionSet = shuffle(set);

  questionHistory.set(selectedLevel, [...recentMatches, questionSet.map(question => question.id)].slice(-matchesToRemember));
  return questionSet;
}

export { roundsPerMatch };

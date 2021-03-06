import * as React from 'react';
import { Typography, Button } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {
  Verb,
  VerbQuiz,
  createDefaultVerbQuiz,
  VerbCorrect,
  createDefaultVerbCorrect,
} from './test-verb-forms.vm';
import { Formik, Form } from 'formik';
import { TextFieldComponent } from 'common/components';
import { answerIsCorrect } from './test-verb-forms.business';
import { ShowResults } from './components';
import * as classes from './test-verb-forms.styles';

interface Props {
  currentQuestion: number;
  totalQuestions: number;
  onNextQuestion: () => void;
  verb: Verb;
  score: number;
  setScore: (value: number) => void;
  hasSecondChance: boolean;
}

export const TestVerbFormComponent: React.FC<Props> = props => {
  const {
    currentQuestion,
    totalQuestions,
    onNextQuestion,
    verb,
    score,
    setScore,
    hasSecondChance,
  } = props;
  const [verbCorrect, setVerbCorrect] = React.useState<VerbCorrect>(
    createDefaultVerbCorrect()
  );
  const [validated, setValidated] = React.useState(false);
  const [secondAttempt, setSecondAttempt] = React.useState(false);

  const [initialQuiz, setInitialQuiz] = React.useState<VerbQuiz>(
    createDefaultVerbQuiz()
  );

  const {
    title,
    mainContainer,
    inputContainer,
    backContainer,
    pictureContainer,
    picture,
    inputField,
    insideBtnContainer,
    nextBtn,
    arrowIcon,
  } = classes;

  const handleValidateAnswer = (isCorrect: VerbCorrect) => {
    if (isCorrect.all) {
      if (secondAttempt) {
        setScore(score + 0.5);
      } else {
        setScore(score + 1);
      }
    }
    setVerbCorrect(isCorrect);
    setValidated(true);
  };

  const internalHandleOnNextQuestion = () => {
    setInitialQuiz(createDefaultVerbQuiz());
    setValidated(false);
    setSecondAttempt(false);
    setVerbCorrect(createDefaultVerbCorrect());
    onNextQuestion();
  };

  const handleSecondAttempt = () => {
    setValidated(false);
    setSecondAttempt(true);
  };

  return (
    <main className={mainContainer}>
      <h1 className={title}>
        Batir ({`${currentQuestion} / ${totalQuestions}`})
      </h1>
      <Formik
        onSubmit={(values, actions) => {
          const isCorrect = answerIsCorrect(verb, values);
          handleValidateAnswer(isCorrect);
          if (!hasSecondChance || secondAttempt || isCorrect.all) {
            actions.resetForm({ values: createDefaultVerbQuiz() });
          }
          if (hasSecondChance && !secondAttempt) {
            if (!isCorrect.infinitive)
              actions.setFieldError('infinitive', 'Incorrect');
            if (!isCorrect.past) actions.setFieldError('past', 'Incorrect');
            if (!isCorrect.participle)
              actions.setFieldError('participle', 'Incorrect');
          }
        }}
        initialValues={initialQuiz}
      >
        {() => (
          <Form>
            {!validated && (
              <div className={backContainer}>
                <div className={pictureContainer}>
                  <img
                    className={picture}
                    // src={`/assets/verb-images/${verb.infinitive}.png`}
                    src={`/assets/verb-images/break.png`}
                  ></img>
                </div>

                {/* <h2>{verb.translation}</h2> */}
                <div className={inputContainer}>
                  <div className={inputField}>
                    <label htmlFor="infinitive">Infinitive</label>
                    <input type="text" name="infinitive" id="infinitive" />
                  </div>
                  <div className={inputField}>
                    <label htmlFor="past">Past</label>
                    <input type="text" name="past" id="past" />
                  </div>
                  <div className={inputField}>
                    <label htmlFor="participle">Participle</label>
                    <input type="text" name="participle" id="participle" />
                  </div>
                </div>
              </div>
            )}
            {validated &&
            (!hasSecondChance || secondAttempt || verbCorrect.all) ? (
              <>
                <ShowResults
                  secondAttempt={true}
                  verbCorrect={verbCorrect}
                  verb={verb}
                />

                <Button
                  onClick={internalHandleOnNextQuestion}
                  variant="contained"
                  color="primary"
                >
                  Next verb
                </Button>
              </>
            ) : validated && !secondAttempt ? (
              <>
                <ShowResults
                  secondAttempt={false}
                  verbCorrect={verbCorrect}
                  verb={verb}
                />

                <Button
                  onClick={handleSecondAttempt}
                  variant="contained"
                  color="primary"
                >
                  Try again
                </Button>
              </>
            ) : (
              <Button
                className={nextBtn}
                type="submit"
                variant="contained"
                disableElevation
              >
                <div className={insideBtnContainer}>
                  Next <ArrowForwardIcon className={arrowIcon} />
                </div>
              </Button>
            )}
          </Form>
        )}
      </Formik>
    </main>
  );
};

/* This example requires Tailwind CSS v2.0+ */

export interface Step {
  id: number
  status: "complete" | "upcoming" | "current"
}

// const steps = [
//   { id: 1, status: "complete" },
//   { id: 2, status: "upcoming" },
// ]

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function Steps({ steps }: { steps: Step[] }) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.id}
            className={classNames(
              stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : "",
              "relative"
            )}
          >
            {step.status === "complete" && (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full bg-orange-600 h-0.5" />
                </div>
                <div className="relative flex items-center justify-center w-8 h-8 text-lg font-medium text-white bg-orange-600 rounded-full">
                  {/* <CheckIcon
                    className="w-5 h-5 text-white"
                    aria-hidden="true"
                  /> */}
                  {step.id}
                  <span className="sr-only">{step.id}</span>
                </div>
              </>
            )}

            {step.status === "current" && (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full bg-orange-600 h-0.5" />
                </div>
                <div className="relative flex items-center justify-center w-8 h-8 text-lg font-medium text-white bg-orange-600 rounded-full">
                  {/* <CheckIcon
                  className="w-5 h-5 text-white"
                  aria-hidden="true"
                /> */}
                  {step.id}
                  <span className="sr-only">{step.id}</span>
                </div>
              </>
            )}

            {step.status === "upcoming" && (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full h-0.5" />
                </div>

                <div className="relative flex items-center justify-center w-8 h-8 text-lg font-medium text-orange-600 border border-orange-600 rounded-full">
                  {step.id}
                  <span className="sr-only">{step.id}</span>
                </div>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

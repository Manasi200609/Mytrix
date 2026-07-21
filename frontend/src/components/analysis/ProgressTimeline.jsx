export default function ProgressTimeline({
  currentStep = 5,
}) {
  const steps = [
    {
      id: 1,
      title: "Clone Repository",
      icon: "git-fork",
    },
    {
      id: 2,
      title: "Parse Repository",
      icon: "code",
    },
    {
      id: 3,
      title: "Build Knowledge Graph",
      icon: "share-2",
    },
    {
      id: 4,
      title: "AI Repository Analysis",
      icon: "brain",
    },
    {
      id: 5,
      title: "Generate Project Memory",
      icon: "database",
    },
  ];

  return (
    <div className="progress-timeline">

      {steps.map((step) => {

        const completed = step.id < currentStep;
        const active = step.id === currentStep;

        return (
          <div
            key={step.id}
            className={`timeline-step
              ${completed ? "completed" : ""}
              ${active ? "active" : ""}
            `}
          >
            <div className="timeline-icon">
              <i className={`ti ti-${step.icon}`} />
            </div>

            <div className="timeline-content">
              <h4>{step.title}</h4>

              <small>
                {completed
                  ? "Completed"
                  : active
                  ? "Running..."
                  : "Pending"}
              </small>
            </div>
          </div>
        );
      })}

    </div>
  );
}
import * as React from "react"

// Mock implementation of Radix UI Collapsible
// This provides basic collapsible functionality without the external dependency

const CollapsibleContext = React.createContext(null)

const Collapsible = ({ open, onOpenChange, children, ...props }) => {
    return (
        <CollapsibleContext.Provider value={{ open, onOpenChange }}>
            <div data-state={open ? "open" : "closed"} {...props}>
                {children}
            </div>
        </CollapsibleContext.Provider>
    )
}

const CollapsibleTrigger = React.forwardRef(({ children, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(CollapsibleContext)

    return (
        <button
            ref={ref}
            type="button"
            onClick={() => onOpenChange(!open)}
            aria-expanded={open}
            {...props}
        >
            {children}
        </button>
    )
})

const CollapsibleContent = React.forwardRef(({ children, ...props }, ref) => {
    const { open } = React.useContext(CollapsibleContext)

    return (
        <div
            ref={ref}
            data-state={open ? "open" : "closed"}
            style={{
                display: open ? "block" : "none",
                overflow: "hidden"
            }}
            {...props}
        >
            {children}
        </div>
    )
})

export { Collapsible, CollapsibleTrigger, CollapsibleContent }

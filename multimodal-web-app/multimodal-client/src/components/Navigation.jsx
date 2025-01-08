import {Link} from 'react-router-dom'
import { Button } from "@/components/ui/button"

export function Navigation() {
    return (
        <div>
            <Button>Click me</Button>
            <Link to="/tasks">
                <h1>Task App</h1>
            </Link>
            <Link to="/tasks-create">create task</Link>
        </div>
    )
}
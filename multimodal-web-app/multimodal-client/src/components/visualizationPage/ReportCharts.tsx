
import { ChartContainer, ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';


const colors = ['#2563eb', '#60a5fa']

const chartConfig = {
  } satisfies ChartConfig

export function ReportCharts({classes, chartData} : {classes:string[],chartData:any}){
    console.log(chartData)
    console.log(classes)
    return (
        <div>
            <ChartContainer config={chartConfig}  className='min-h-[200px] w-1/5'>
            <BarChart accessibilityLayer data={chartData}>
                <YAxis domain={[0,1]}/>
                <XAxis
                    dataKey="label"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                {classes.map((value, index) =>{
                    console.log(value);
                    return <Bar dataKey={value} fill={colors[index]} radius={4} />
                })}
            </BarChart>
            </ChartContainer>
        </div>
    )
}
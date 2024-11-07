using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.ExceptionServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace DutchGrit.Afas
{

    public static class AsyncHelpers
    {
        /// <summary>
        /// Execute's an async Task method which has a void return value synchronously
        /// </summary>
        /// <param name="task">Task method to execute</param>
        public static void RunSync(Func<Task> task)
        {
            var oldContext = SynchronizationContext.Current;
            // Do we have an active synchronization context?
            if (oldContext == null)
            {
                // We can run synchronously without any issue.    
                task().GetAwaiter().GetResult();
                return;
            }
            try
            {
                var synch = new ExclusiveSynchronizationContext();
                SynchronizationContext.SetSynchronizationContext(synch);
                synch.Post(async _ =>
                {
                    try
                    {
                        await task().ConfigureAwait(false);
                    }
                    catch (Exception e)
                    {
                        synch.InnerException = e;
                        throw;
                    }
                    finally
                    {
                        synch.EndMessageLoop();
                    }
                }, null);
                synch.BeginMessageLoop();
            }
            catch (AggregateException ex)
            {
                var exception = ex.ExtractSingleInnerException();
                ExceptionDispatchInfo.Capture(exception).Throw();
            }
            finally
            {
                SynchronizationContext.SetSynchronizationContext(oldContext);
            }
        }
        /// <summary>
        /// Execute's an async Task method which has a T return type synchronously
        /// </summary>
        /// <typeparam name="T">Return Type</typeparam>
        /// <param name="task">Task method to execute</param>
        /// <returns></returns>
        public static T RunSync<T>(Func<Task<T>> task)
        {
            var oldContext = SynchronizationContext.Current;
            // Do we have an active synchronization context?
            if (oldContext == null)
            {
                // We can run synchronously without any issue.    
                return task().GetAwaiter().GetResult();
            }
            var result = default(T);
            var sp = Stopwatch.StartNew();
            try
            {
                var synch = new ExclusiveSynchronizationContext();
                SynchronizationContext.SetSynchronizationContext(synch);
                synch.Post(async _ =>
                {
                    try
                    {
                        result = await task().ConfigureAwait(false);
                    }
                    catch (Exception e)
                    {
                        synch.InnerException = e;
                        throw;
                    }
                    finally
                    {
                        sp.Stop();
                        synch.EndMessageLoop();
                    }
                }, null);
                synch.BeginMessageLoop();
            }
            catch (AggregateException ex)
            {
                var exception = ex.ExtractSingleInnerException();
                if (exception is OperationCanceledException)
                    throw new TimeoutException("Operation timed out after: " + sp.Elapsed, ex);
                ExceptionDispatchInfo.Capture(exception).Throw();
            }
            finally
            {
                SynchronizationContext.SetSynchronizationContext(oldContext);
            }
            return result;
        }
        /// <summary>
        /// Runs an async operation (using Task.Run(...))
        /// </summary>
        /// <typeparam name="TReturnType">Return type for the task</typeparam>
        /// <param name="task">The task to run (Func(...)</param>
        /// <returns>The result of the task</returns>
        public static async Task<TReturnType> RunAsyncTask<TReturnType>(Func<TReturnType> task)
        {
            return await Task.Run(task);
        }
        /// <summary>
        /// Runs an async operation (using Task.Run(...)), and returns directly
        /// </summary>
        /// <param name="task">The task to run (Func(...)</param>
        /// <returns>The result of the task</returns>
        public static void RunAsyncTaskInBackground(Action task)
        {
            Task.Run(task);
        }
        private class ExclusiveSynchronizationContext : SynchronizationContext
        {
            private readonly AutoResetEvent workItemsWaiting = new AutoResetEvent(false);
            private readonly Queue<Tuple<SendOrPostCallback, object>> items = new Queue<Tuple<SendOrPostCallback, object>>();
            private bool done;
            public Exception InnerException { get; set; }
            public override void Send(SendOrPostCallback d, object state)
            {
                throw new NotSupportedException("We cannot send to our same thread");
            }
            public override void Post(SendOrPostCallback d, object state)
            {
                lock (items)
                {
                    items.Enqueue(Tuple.Create(d, state));
                }
                workItemsWaiting.Set();
            }
            public void EndMessageLoop()
            {
                Post(_ => done = true, null);
            }
            public void BeginMessageLoop()
            {
                while (!done)
                {
                    Tuple<SendOrPostCallback, object> task = null;
                    lock (items)
                    {
                        if (items.Count > 0)
                        {
                            task = items.Dequeue();
                        }
                    }
                    if (task != null)
                    {
                        task.Item1(task.Item2);
                        if (InnerException != null) // the method threw an exeption
                        {
                            throw new AggregateException("AsyncHelpers.Run method threw an exception.", InnerException);
                        }
                    }
                    else
                    {
                        workItemsWaiting.WaitOne();
                    }
                }
            }
            public override SynchronizationContext CreateCopy()
            {
                return this;
            }
        }
    }


    public static class ExceptionExtensions
    {
        /// <summary>
        /// Recursively examines the inner exceptions of an <see cref="AggregateException"/> and returns a single child exception.
        /// </summary>
        /// <returns>
        /// If any of the aggregated exceptions have more than one inner exception, null is returned.
        /// </returns>
        public static Exception ExtractSingleInnerException(this AggregateException e)
        {
            if (e == null)
                return null;
            while (true)
            {
                if (e.InnerExceptions.Count != 1)
                    return e;
                var aggregateException = e.InnerExceptions[0] as AggregateException;
                if (aggregateException == null)
                    break;
                e = aggregateException;
            }
            return e.InnerExceptions[0];
        }

        /// <summary>
        /// Extracts a portion of an exception for a user friendly display
        /// </summary>
        /// <param name="e">The exception.</param>
        /// <returns>The primary portion of the exception message.</returns>
        public static string SimplifyError(this Exception e)
        {
            var parts = e.Message.Split(new[] { "\r\n   " }, StringSplitOptions.None);
            var firstLine = parts.First();
            var index = firstLine.IndexOf(':');
            return index > 0
                ? firstLine.Remove(0, index + 2)
                : firstLine;
        }
    }





}

import { Ticket } from "../ticket";

it('impletes optimistic concurrency control', async () =>{
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: 'asdf',
    price:4,
    userId:'2343'
  });

  // save the ticket to the database  
  await ticket.save();

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // mkae two separate changes to the tickets we fetched
  firstInstance!.set({ price: 10});
  secondInstance!.set({ price:15});

  // save first fetched ticket 
  await firstInstance!.save();

  // save the second fetched ticket and expect an error
    try {
      await secondInstance!.save();
    } catch (err) {
      return;
    }
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'asdf',
    price: 23,
    userId: '234'
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
})
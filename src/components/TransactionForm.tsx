import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface Stock {
  stockid: number;
  tickersymbol: string;
  companyname: string;
}

interface NewStock {
  tickerSymbol: string;
  companyName: string;
  market: string;
  sector: string;
}

const TransactionForm: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<string>('');
  const [transactionType, setTransactionType] = useState<'Buy' | 'Sell'>('Buy');
  const [quantity, setQuantity] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [date, setDate] = useState<Date | null>(new Date());
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState<Date | null>(new Date());
  const [openNewStockDialog, setOpenNewStockDialog] = useState<boolean>(false);
  const [newStock, setNewStock] = useState<NewStock>({
    tickerSymbol: '',
    companyName: '',
    market: '',
    sector: '',
  });

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await axios.get<Stock[]>('/api/stocks');
      setStocks(response.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/transactions', {
        stockId: selectedStock,
        transactionType,
        quantity: parseInt(quantity),
        transactionPrice: parseFloat(price),
        transactionDate: date?.toISOString(),
        purchasePrice: parseFloat(purchasePrice),
        purchaseDate: purchaseDate?.toISOString(),
      });
      console.log('Transaction created:', response.data);
      // Reset form
      setSelectedStock('');
      setTransactionType('Buy');
      setQuantity('');
      setPrice('');
      setDate(new Date());
      setPurchasePrice('');
      setPurchaseDate(new Date());
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const handleNewStockSubmit = async () => {
    try {
      const response = await axios.post('/api/stocks', newStock);
      console.log('New stock created:', response.data);
      setOpenNewStockDialog(false);
      setNewStock({
        tickerSymbol: '',
        companyName: '',
        market: '',
        sector: '',
      });
      fetchStocks();
    } catch (error) {
      console.error('Error creating new stock:', error);
    }
  };

  return (
    <Paper elevation={3} className="p-8">
      <Typography variant="h6" gutterBottom>
        Add New Transaction
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Stock</InputLabel>
              <Select
                value={selectedStock}
                onChange={(e: SelectChangeEvent) => setSelectedStock(e.target.value)}
                required
              >
                {stocks.map((stock) => (
                  <MenuItem key={stock.stockid} value={stock.stockid}>
                    {stock.tickersymbol} - {stock.companyname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setOpenNewStockDialog(true)}
            >
              Add New Stock
            </Button>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Transaction Type</InputLabel>
              <Select
                value={transactionType}
                onChange={(e: SelectChangeEvent<'Buy' | 'Sell'>) => setTransactionType(e.target.value as 'Buy' | 'Sell')}
                required
              >
                <MenuItem value="Buy">Buy</MenuItem>
                <MenuItem value="Sell">Sell</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Transaction Price"
              type="number"
              inputProps={{ step: "0.01" }}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Transaction Date"
                value={date}
                onChange={(newDate) => setDate(newDate)}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Purchase Price"
              type="number"
              inputProps={{ step: "0.01" }}
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Purchase Date"
                value={purchaseDate}
                onChange={(newDate) => setPurchaseDate(newDate)}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Add Transaction
            </Button>
          </Grid>
        </Grid>
      </form>

      <Dialog open={openNewStockDialog} onClose={() => setOpenNewStockDialog(false)}>
        <DialogTitle>Add New Stock</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Ticker Symbol"
            fullWidth
            value={newStock.tickerSymbol}
            onChange={(e) => setNewStock({ ...newStock, tickerSymbol: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Company Name"
            fullWidth
            value={newStock.companyName}
            onChange={(e) => setNewStock({ ...newStock, companyName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Market"
            fullWidth
            value={newStock.market}
            onChange={(e) => setNewStock({ ...newStock, market: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Sector"
            fullWidth
            value={newStock.sector}
            onChange={(e) => setNewStock({ ...newStock, sector: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewStockDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleNewStockSubmit} color="primary">
            Add Stock
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TransactionForm;
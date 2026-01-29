import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  type Node,
  type Edge,
  type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";
import { Menu as MenuIcon, History as HistoryIcon } from "@mui/icons-material";
import EditableNode from "./EditableNode";
import ScrollableOutputNode from "./ScrollableOutputNode";

interface ChatHistory {
  _id: string;
  prompt: string;
  response: string;
  createdAt: string;
}

const nodeTypes = {
  editableNode: EditableNode,
  scrollableOutput: ScrollableOutputNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "editableNode",
    data: { 
      label: "",
      onTextChange: () => {}
    },
    position: { x: 100, y: 100 },
  },
  {
    id: "2",
    type: "scrollableOutput",
    data: { label: "AI Response will appear here" },
    position: { x: 400, y: 100 },
  },
];

const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }];

const URI = "http://localhost:3001/api";

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [history, setHistory] = useState<ChatHistory[]>([]);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${URI}/history`);
      setHistory(res.data.data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleTextChange = useCallback((nodeId: string, newText: string) => {
    setPrompt(newText);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, label: newText } };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Update the onTextChange callback in nodes
  const nodesWithCallback = nodes.map((node) => {
    if (node.type === 'editableNode') {
      return {
        ...node,
        data: {
          ...node.data,
          onTextChange: handleTextChange,
        },
      };
    }
    return node;
  });

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const runFlow = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post(`${URI}/ask-ai`, { prompt });
      const aiResponse = res.data.response;
      setResponse(aiResponse);

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === "2") {
            return { ...node, data: { label: aiResponse } };
          }
          return node;
        }),
      );
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error getting AI response");
    }
    setLoading(false);
  };

  const saveConversation = async () => {
    if (!prompt || !response) return;

    try {
      await axios.post(`${URI}/save`, { prompt, response });
      fetchHistory(); // Refresh history after saving
      alert("Conversation saved!");
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving conversation");
    }
  };

  const loadHistoryItem = (item: ChatHistory) => {
    setPrompt(item.prompt);
    setResponse(item.response);
    
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === "1") {
          return { ...node, data: { ...node.data, label: item.prompt } };
        }
        if (node.id === "2") {
          return { ...node, data: { label: item.response } };
        }
        return node;
      })
    );
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <HistoryIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Chat Flow
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ flex: 1, py: 2 }}>
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt..."
              variant="outlined"
              size="small"
              sx={{ flexGrow: 1, minWidth: '200px' }}
            />
            <Button
              onClick={runFlow}
              disabled={loading}
              variant="contained"
              color="primary"
            >
              {loading ? "Running..." : "Run Flow"}
            </Button>
            <Button
              onClick={saveConversation}
              disabled={!response}
              variant="outlined"
              color="secondary"
            >
              Save
            </Button>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ height: isMobile ? '60vh' : '70vh' }}>
          <ReactFlow
            nodes={nodesWithCallback}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>
        </Paper>
      </Container>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Chat History
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {history.map((item) => (
              <ListItem
                key={item._id}
                button
                onClick={() => loadHistoryItem(item)}
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' } }}
              >
                <ListItemText
                  primary={item.prompt.substring(0, 50) + '...'}
                  secondary={new Date(item.createdAt).toLocaleDateString()}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
